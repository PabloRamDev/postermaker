import ImageForm from "./components/image-form";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitSection from "./components/submit-section";
import * as z from "zod";
import { formSchema } from "./schemas/form-schema";
import { useFileStore } from "./store/file-store";
import { ArrowUpFromLineIcon, DownloadIcon, RotateCcw } from "lucide-react";
import Preview from "./components/preview";
import { Button } from "./components/ui/button";
import { usePrompt } from "./hooks/use-prompt";
import TextSection from "./components/text-section";
import { useMediaQuery } from "react-responsive";

function App() {
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sheets_horizontal: "1",
      image: [],
    },
  });

  const images = methods.watch("image");
  const sheets = methods.watch("sheets_horizontal");

  const {
    fileUrl,
    preview,
    previewHeight,
    previewWidth,
    setPreview,
    setFileUrl,
    setOpen,
  } = useFileStore();

  const handleClose = () => {
    methods.reset();
    setPreview(null);
    setFileUrl("");
  };

  const [newPrompt] = usePrompt();

  return (
    <main className="flex frosted-backdrop h-dvh w-dvw">
      <FormProvider {...methods}>
        <div className="flex flex-col items-center justify-center w-full gap-8 px-8 lg:px-0 py-20">
          <TextSection
            isDirty={methods.formState.isDirty}
            isSubmitSuccessful={methods.formState.isSubmitSuccessful}
          />
          {preview !== null &&
          previewHeight > 0 &&
          previewWidth > 0 &&
          parseInt(sheets) > 0 ? (
            <>
              <Preview
                imageUrl={preview[0].preview}
                width={previewWidth}
                height={previewHeight}
                horizontal_sheets={parseInt(sheets)}
                onClose={() => {
                  newPrompt({
                    callback: handleClose,
                    text: "Esta acción reiniciará el formulario. ¿Desea continuar?",
                  });
                }}
                disabled={methods.formState.isSubmitting}
                showClose={!methods.formState.isSubmitSuccessful}
              />
              {isTabletOrMobile && (
                <Button variant="outline" aria-label="Submit" onClick={setOpen}>
                  Abrir formulario
                  <ArrowUpFromLineIcon />
                </Button>
              )}
            </>
          ) : (
            <ImageForm />
          )}

          {fileUrl !== "" && (
            <div className="flex w-auto items-center justify-center gap-2 px-20">
              <Button asChild className="flex basis-1">
                <a className="w-full" href={fileUrl} download={"poster"}>
                  Descargar
                  <DownloadIcon />
                </a>
              </Button>
              <Button
                variant="destructive"
                className="flex basis-1"
                onClick={() =>
                  newPrompt({
                    callback: handleClose,
                    text: "Esta acción reiniciará el formulario. ¿Desea continuar?",
                  })
                }
              >
                Reiniciar
                <RotateCcw />
              </Button>
            </div>
          )}
        </div>
        {images.length > 0 && <SubmitSection />}
      </FormProvider>
    </main>
  );
}

export default App;
