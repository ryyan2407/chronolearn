import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

type JsonRecord = Record<string, unknown>;

type AuthResponse = {
  user: {
    id: string;
    email: string;
  };
};

type MaterialListItem = {
  id: string;
  title: string;
};

type QuizQuestion = {
  id: string;
  type: "MCQ" | "SHORT_ANSWER";
  correctAnswer?: string | null;
  options?: string[] | null;
};

type Quiz = {
  id: string;
  questions: QuizQuestion[];
};

type Attempt = {
  id: string;
  totalScore: number;
  maxScore: number;
  answers?: Array<{ id: string }>;
};

type AnalyticsOverview = {
  materials: number;
  quizzes: number;
  attempts: number;
};

const API_BASE_URL = process.env.DEMO_CHECK_API_BASE_URL ?? "http://127.0.0.1:4000/api";

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const summarize = (label: string, value: unknown) => {
  console.log(`${label}: ${typeof value === "string" ? value : JSON.stringify(value)}`);
};

class CookieSession {
  private cookieJar = new Map<string, string>();

  private updateCookieJar(response: Response) {
    const headers = response.headers as Headers & { getSetCookie?: () => string[] };
    const setCookieHeaders = headers.getSetCookie?.() ?? [];

    for (const cookie of setCookieHeaders) {
      const [nameValue] = cookie.split(";", 1);
      const [name, ...valueParts] = nameValue.split("=");

      if (!name) {
        continue;
      }

      this.cookieJar.set(name, valueParts.join("="));
    }
  }

  private get cookieHeader() {
    return Array.from(this.cookieJar.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }

  async request(path: string, init: RequestInit = {}) {
    const headers = new Headers(init.headers);

    if (this.cookieJar.size > 0) {
      headers.set("cookie", this.cookieHeader);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers
    });

    this.updateCookieJar(response);
    return response;
  }

  async requestJson<T>(path: string, init: RequestInit = {}, expectedStatus = 200): Promise<T> {
    const response = await this.request(path, init);
    const text = await response.text();

    if (response.status !== expectedStatus) {
      throw new Error(`Expected ${expectedStatus} from ${path}, got ${response.status}: ${text}`);
    }

    return (text ? JSON.parse(text) : null) as T;
  }
}

const buildPdfBuffer = () => {
  const workspace = mkdtempSync(join(tmpdir(), "chronolearn-demo-check-"));
  const postscriptPath = join(workspace, "demo.ps");
  const pdfPath = join(workspace, "demo.pdf");

  try {
    writeFileSync(
      postscriptPath,
      [
        "%!PS-Adobe-3.0",
        "/Times-Roman findfont 14 scalefont setfont",
        "72 720 moveto",
        "(ChronoLearn demo PDF about the French Revolution, taxation, inequality, and political crisis.) show",
        "showpage",
        ""
      ].join("\n")
    );

    execFileSync("gs", [
      "-q",
      "-dNOPAUSE",
      "-dBATCH",
      "-sDEVICE=pdfwrite",
      `-sOutputFile=${pdfPath}`,
      postscriptPath
    ]);

    return readFileSync(pdfPath);
  } catch (error) {
    throw new Error(`Could not generate the demo PDF fixture. ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
};

const main = async () => {
  const session = new CookieSession();
  const uniqueId = Date.now();
  const email = `demo-check.${uniqueId}@example.com`;
  const validPdfBuffer = buildPdfBuffer();

  const registerResponse = await session.requestJson<AuthResponse>(
    "/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Demo Check User",
        email,
        password: "supersecure123"
      })
    },
    201
  );

  expect(registerResponse.user.email === email, "Registration did not return the expected user.");

  const meResponse = await session.requestJson<AuthResponse>("/auth/me");
  expect(meResponse.user.email === email, "Authenticated session did not survive the register response.");

  const topicMaterial = await session.requestJson<JsonRecord>(
    "/materials/topic",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "French Revolution Notes",
        topic: "French Revolution",
        sourceText:
          "The French Revolution emerged from economic strain, social inequality, and political crisis. The Third Estate carried major tax burdens while the monarchy struggled with debt and legitimacy."
      })
    },
    201
  );

  const uploadFormData = new FormData();
  uploadFormData.append("title", "French Revolution PDF");
  uploadFormData.append("file", new Blob([validPdfBuffer], { type: "application/pdf" }), "chronolearn-demo.pdf");

  const pdfMaterial = await session.requestJson<JsonRecord>(
    "/materials/upload",
    {
      method: "POST",
      body: uploadFormData
    },
    201
  );

  const materials = await session.requestJson<MaterialListItem[]>("/materials");
  expect(materials.length >= 2, "Expected at least two materials after topic and PDF creation.");

  const pdfMaterialId = String(pdfMaterial.id);
  expect(pdfMaterialId.length > 0, "PDF upload did not return a material id.");

  const quiz = await session.requestJson<Quiz>(
    "/quiz/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        materialId: pdfMaterialId,
        title: "French Revolution Quiz",
        mcqCount: 2,
        shortAnswerCount: 1
      })
    },
    201
  );

  expect(quiz.questions.length === 3, "Quiz generation did not return the expected number of questions.");

  const quizDetail = await session.requestJson<Quiz>(`/quiz/${quiz.id}`);
  expect(quizDetail.questions.length === 3, "Quiz detail did not return the persisted questions.");

  const answers = quizDetail.questions.map((question) => {
    if (question.type === "MCQ") {
      return {
        questionId: question.id,
        answer: question.correctAnswer ?? question.options?.[0] ?? ""
      };
    }

    return {
      questionId: question.id,
      answer: "Economic strain, taxation, and social inequality destabilized France."
    };
  });

  const attempt = await session.requestJson<Attempt>(
    "/attempts/submit",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quizId: quiz.id,
        answers
      })
    },
    201
  );

  expect(attempt.id.length > 0, "Attempt submission did not return an attempt id.");

  const attemptDetail = await session.requestJson<Attempt>(`/attempts/${attempt.id}`);
  expect(attemptDetail.answers?.length === 3, "Persisted attempt detail did not include all answers.");

  const attempts = await session.requestJson<Attempt[]>("/attempts");
  expect(attempts.some((item) => item.id === attempt.id), "Attempt history did not include the submitted attempt.");

  const analytics = await session.requestJson<AnalyticsOverview>("/analytics/overview");
  expect(analytics.materials >= 2, "Analytics did not count materials correctly.");
  expect(analytics.quizzes >= 1, "Analytics did not count quizzes correctly.");
  expect(analytics.attempts >= 1, "Analytics did not count attempts correctly.");

  const invalidUploadFormData = new FormData();
  invalidUploadFormData.append("file", new Blob(["not a pdf"], { type: "text/plain" }), "invalid.txt");

  const invalidUploadResponse = await session.request("/materials/upload", {
    method: "POST",
    body: invalidUploadFormData
  });
  expect(invalidUploadResponse.status === 400, "Non-PDF upload should be rejected.");

  const malformedUploadFormData = new FormData();
  malformedUploadFormData.append(
    "file",
    new Blob([validPdfBuffer.subarray(0, 64)], { type: "application/pdf" }),
    "broken.pdf"
  );

  const malformedUploadResponse = await session.request("/materials/upload", {
    method: "POST",
    body: malformedUploadFormData
  });
  expect(malformedUploadResponse.status === 400, "Unreadable PDF upload should fail cleanly.");

  const partialAttempt = await session.requestJson<Attempt>(
    "/attempts/submit",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quizId: quiz.id,
        answers: [
          {
            questionId: quizDetail.questions[0]?.id,
            answer: ""
          }
        ]
      })
    },
    201
  );
  expect(partialAttempt.totalScore === 0, "Partial blank submission should score zero.");

  const logoutResponse = await session.requestJson<{ success: boolean }>(
    "/auth/logout",
    {
      method: "POST"
    }
  );
  expect(logoutResponse.success, "Logout did not succeed.");

  const postLogoutResponse = await session.request("/auth/me");
  expect(postLogoutResponse.status === 401, "Session should be invalid after logout.");

  summarize("apiBaseUrl", API_BASE_URL);
  summarize("registeredUser", registerResponse.user.email);
  summarize("topicMaterialId", topicMaterial.id);
  summarize("pdfMaterialId", pdfMaterial.id);
  summarize("quizId", quiz.id);
  summarize("attemptId", attempt.id);
  summarize("attemptScore", `${attempt.totalScore}/${attempt.maxScore}`);
  summarize("analytics", analytics);
  console.log("demo-ready-check: PASS");
};

main().catch((error) => {
  console.error("demo-ready-check: FAIL");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
