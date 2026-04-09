import { MaterialType } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { chunkText } from "../../services/pdf/chunkText.js";
import { parsePdfBuffer } from "../../services/pdf/pdfParser.service.js";
import { cleanText } from "../../services/pdf/textCleaner.js";

type CreateTopicMaterialInput = {
  title: string;
  topic: string;
  sourceText: string;
  userId: string;
};

export const materialsService = {
  async createTopicMaterial(input: CreateTopicMaterialInput) {
    const extractedText = cleanText(input.sourceText);
    const chunks = chunkText(extractedText);

    return prisma.material.create({
      data: {
        title: input.title,
        type: MaterialType.TOPIC,
        topic: input.topic,
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
    const chunks = chunkText(extractedText);

    return prisma.material.create({
      data: {
        title: params.title,
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
