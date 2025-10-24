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
import FormWrapper from "./form-wrapper";

export default function SubmitSection() {
  const { control, formState, handleSubmit } =
    useFormContext();
  const { setUploadProgress, setFileUrl, setClose } =
    useFileStore();


  const onSubmit = async (data) => {
    const formData = new FormData();
    const image = data.image[0];
    formData.append("image", image);
    formData.append("sheets_horizontal", data.sheets_horizontal);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/image-pdf/`,
        formData,
        {
          responseType: "blob", // Important for file download
          onUploadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentage);
            }
          },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setFileUrl(url);

      setClose()

    } catch (error) {
      console.error("Download failed:", error);
    }

    
  };

  return (
    <FormWrapper>
      <FieldSet className="w-full flex flex-col justify-center">
        <FieldLegend className="text-3xl font-semibold">
          Configuración
        </FieldLegend>
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
                  {
                    [...Array(6).keys()].map(n =><SelectItem key={`option-${n+1}`} value={`${n + 1}`}>{n + 1}</SelectItem>)
                  }
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldSet>

      <Button
        type="submit"
        onClick={handleSubmit(onSubmit)}
        className="mt-auto font-semibold"
        disabled={formState.isSubmitting}
      >
        Continuar
        {!formState.isSubmitting ? <ArrowRight /> : <Spinner />}
      </Button>
    </FormWrapper>
  );
}
