import type { Request, Response } from "express";

import { AppError } from "../../utils/AppError.js";
import { materialsService } from "./materials.service.js";

export const materialsController = {
  async createTopic(req: Request, res: Response) {
    const material = await materialsService.createTopicMaterial({
      ...req.body,
      userId: req.authUser!.id
    });
    res.status(201).json(material);
  },

  async uploadPdf(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError("PDF file is required", 400);
    }

    const title = typeof req.body.title === "string" ? req.body.title : req.file.originalname;
    const material = await materialsService.createPdfMaterial({
      title,
      fileName: req.file.originalname,
      fileBuffer: req.file.buffer,
      userId: req.authUser!.id
    });

    res.status(201).json(material);
  },

  async list(req: Request, res: Response) {
    const materials = await materialsService.listMaterials(req.authUser!.id);
    res.json(materials);
  }
};
