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

export default function SubmitSection() {
  const { control, formState, handleSubmit } = useFormContext();

    const onSubmit = async (data) => {
    const formData = new FormData();
    const image = data.image[0];
    formData.append("image", image);
    formData.append("sheets_horizontal", data.sheets_horizontal);
    await fetch(`http://127.0.0.1:8000/api/image-pdf/`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                // When no more data needs to be consumed, close the stream
                if (done) {
                  controller.close();
                  return;
                }
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                return pump();
              });
            }
          },
        });
      })
      // Create a new response out of the stream
      .then((stream) => new Response(stream))
      // Create an object URL for the response
      .then((response) => response.blob())
      .then((blob) => URL.createObjectURL(blob))
      // Update image
      .then((url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = "document.pdf"
        link.click();

      });
  };

  return (
    <aside className="flex grow flex-col p-8 gap-4 bg-muted w-1/2 h-full">
      <FieldSet className="w-full">
        <FieldLegend>Poster width</FieldLegend>
        <FieldDescription>
          Select the width of the poster as the number of sheets wide
        </FieldDescription>

        <Controller
          control={control}
          name={"sheets_horizontal"}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Number of sheets</FieldLabel>
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select number" />
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

      <Button type="submit" onClick={handleSubmit(onSubmit)} className="mt-auto" disabled={formState.isSubmitting}>
        {formState.isSubmitting && <Spinner />}
        Submit
      </Button>
    </aside>
  );
}
