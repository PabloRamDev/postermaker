import { formSchema } from "@/schemas/form-schema";
import { useFileStore } from "@/store/file-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { usePrompt } from "./use-prompt";
import { useCallback } from "react";

export function usePosterForm() {
  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sheets_horizontal: 1,
      image: null,
    },
  });
  
  const { fileUrl, setPreview, setFileUrl } = useFileStore();
  const [newPrompt] = usePrompt();
  
  const resetForm = useCallback(() => {
    methods.reset();
    setPreview(null);
    
    // Revoke old URL before clearing
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFileUrl("");
  }, [methods, setPreview, setFileUrl, fileUrl]);
  
  const handleResetWithPrompt = useCallback(() => {
    newPrompt({
      callback: resetForm,
      text: "Esta acción reiniciará el formulario. ¿Desea continuar?",
    });
  }, [newPrompt, resetForm]);
  
  return {
    methods,
    resetForm,
    handleResetWithPrompt,
  };
}