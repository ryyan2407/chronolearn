import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const createDemoPdfBuffer = () => {
  const workspace = mkdtempSync(join(tmpdir(), "chronolearn-playwright-"));
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
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
};
