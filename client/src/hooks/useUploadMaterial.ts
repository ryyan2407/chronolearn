import { useMutation, useQueryClient } from "@tanstack/react-query";

import { materialsService } from "../services/materials.service";
import type { CreateTopicMaterialInput } from "../types/material";

export function useUploadMaterial() {
  const queryClient = useQueryClient();

  const topicMutation = useMutation({
    mutationFn: (payload: CreateTopicMaterialInput) => materialsService.createTopic(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["materials"] });
    }
  });

  const pdfMutation = useMutation({
    mutationFn: (formData: FormData) => materialsService.uploadPdf(formData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["materials"] });
    }
  });

  return { topicMutation, pdfMutation };
}
