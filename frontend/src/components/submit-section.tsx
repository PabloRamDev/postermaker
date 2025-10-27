import { Controller, useFormContext } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./ui/field";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { useFileStore } from "@/store/file-store";
import FormWrapper from "./form-wrapper";
import { Slider } from "./ui/slider";

export default function SubmitSection() {
  const { control, formState, handleSubmit } =
    useFormContext();
  const { setFileUrl, setClose } =
    useFileStore();


  const onSubmit = async (data) => {
    const formData = new FormData();
    const image = data.image[0];
    formData.append("image", image);
    formData.append("sheets_horizontal", data.sheets_horizontal);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/image-pdf/` || 'http://localhost:8003/api/image-pdf',
        formData,
        {
          responseType: "blob", // Important for file download
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
      <Slider
        value={[field.value]}
        onValueChange={(values) => field.onChange(values[0])}
        min={1}
        max={6}
        step={1}
        className="w-full max-w-md"
      />
          <div className="flex justify-between text-xs text-muted-foreground max-w-md">
      {[1, 2, 3, 4, 5, 6].map(n => (
        <span key={n}>{n}</span>
      ))}
    </div>
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
