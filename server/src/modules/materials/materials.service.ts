import { MaterialType } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { chunkText } from "../../services/pdf/chunkText.js";
import { parsePdfBuffer } from "../../services/pdf/pdfParser.service.js";
import { cleanText } from "../../services/pdf/textCleaner.js";
import { AppError } from "../../utils/AppError.js";

type CreateTopicMaterialInput = {
  title: string;
  topic: string;
  sourceText: string;
  userId: string;
};

export const materialsService = {
  async createTopicMaterial(input: CreateTopicMaterialInput) {
    const extractedText = cleanText(input.sourceText);
    const title = input.title.trim();
    const topic = input.topic.trim();

    if (extractedText.length < 20) {
      throw new AppError("Add at least 20 characters of study material before creating a topic.", 400, "SOURCE_TEXT_TOO_SHORT");
    }

    const chunks = chunkText(extractedText);

    return prisma.material.create({
      data: {
        title,
        type: MaterialType.TOPIC,
        topic,
        extractedText,
        userId: input.userId,
        chunks: {
          create: chunks.map((content, index) => ({
            content,
            orderIndex: index
          }))
        }
      }
    });
  },

  async createPdfMaterial(params: {
    title: string;
    fileName: string;
    fileBuffer: Buffer;
    userId: string;
  }) {
    const extractedText = await parsePdfBuffer(params.fileBuffer);

    if (extractedText.length < 30) {
      throw new AppError(
        "The uploaded PDF did not contain enough readable text to create study material.",
        400,
        "PDF_TEXT_EMPTY"
      );
    }

    const chunks = chunkText(extractedText);

    return prisma.material.create({
      data: {
        title: params.title.trim() || params.fileName,
        type: MaterialType.PDF,
        originalFileUrl: params.fileName,
        extractedText,
        userId: params.userId,
        chunks: {
          create: chunks.map((content, index) => ({
            content,
            orderIndex: index
          }))
        }
      }
    });
  },

  listMaterials(userId: string) {
    return prisma.material.findMany({
      where: {
        userId
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        type: true,
        topic: true,
        createdAt: true
      }
    });
  }
};
