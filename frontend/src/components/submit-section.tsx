import { Controller, useFormContext } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { useFileStore } from "@/store/file-store";
import Preview from "./preview";

export default function SubmitSection() {

  const { control, formState, handleSubmit, watch} = useFormContext();
    const { setUploadProgress, setFileUrl, preview, previewHeight, previewWidth } = useFileStore();

    console.log(preview)
    console.log(previewHeight)
    console.log(previewWidth)
    const sheets = watch("sheets_horizontal");

    const onSubmit = async (data) => {
    const formData = new FormData();
    const image = data.image[0];
    formData.append("image", image);
    formData.append("sheets_horizontal", data.sheets_horizontal);

    try {
    const response = await axios.post("http://127.0.0.1:8000/api/image-pdf/", formData, {
      responseType: "blob", // Important for file download
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentage);
        }
      },
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setFileUrl(url);

  } catch (error) {
    console.error("Download failed:", error);
  }
  };

  return (
    <aside className="flex grow flex-col items-center p-8 gap-4 dark:bg-muted border-l-2 botder-mutted w-1/2 h-full">
      <FieldSet className="w-full">
        <FieldLegend className="text-3xl font-semibold">Configuración</FieldLegend>
        <FieldDescription>
          Configura las dimensiones y características del poster
        </FieldDescription>

        <Controller
          control={control}
          name={"sheets_horizontal"}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Hojas en horizontal</FieldLabel>
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccione número" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldSet>
{
  preview !== null && previewHeight > 0 && previewWidth > 0 && sheets > 0 && 
  <Preview imageUrl={preview[0].preview} width={previewWidth} height={previewHeight} horizontal_sheets={sheets}/>
}

      <Button type="submit" onClick={handleSubmit(onSubmit)} className="mt-auto font-semibold" disabled={formState.isSubmitting}>
        {formState.isSubmitting && <Spinner />}
        Continuar
        {!formState.isSubmitting && <ArrowRight />}
      </Button>
      {/* <Button variant="destructive" onClick={reset} >
Cancelar
      </Button> */}
    </aside>
  );
}
