import ImageForm from "./components/image-form";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitSection from "./components/submit-section";
import * as z from "zod";
import { formSchema } from "./schemas/form-schema";
import { useFileStore } from "./store/file-store";
import { DownloadIcon, RotateCcw } from "lucide-react";
import Preview from "./components/preview";
import { Button } from "./components/ui/button";
import { usePrompt } from "./hooks/use-prompt";

function App() {
  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sheets_horizontal: "1",
      image: [],
    },
  });

  const images = methods.watch("image");
  const sheets = methods.watch("sheets_horizontal");

  const { fileUrl, preview, previewHeight, previewWidth, setPreview, setFileUrl } = useFileStore();

  const handleClose = () => {
    methods.reset(); 
    setPreview(null); 
    setFileUrl("")
  }

  const [newPrompt] = usePrompt();

  return (
    <main className="flex frosted-backdrop h-screen w-full min-h-screen max-w-screen">
      <FormProvider {...methods}>
        <div className="flex flex-col h-full items-center justify-center w-full gap-8 px-8 py-20">
          <section className="flex flex-col justify-center w-full gap-2 items-center">
            <h1 className="text-3xl lg:text-5xl font-black">P O S T E R M A K E R</h1>
            {!methods.formState.isDirty ? (
              <p className="text-center text-xl font-light">
                Sube una imagen y crea un poster para imprimir
              </p>
            ) :  methods.formState.isSubmitSuccessful ? (
              <>
                <p className=" flex flex-col text-center text-xl font-semibold">
                  Éxito
                  <span className="font-light text-muted-foreground text-sm">
                    Su póster está listo para ser descargado
                  </span>
                </p>
              </>
            ) :
            (
              <>
                <p className=" flex flex-col text-center text-xl font-semibold">
                  Previsualización
                  <span className="font-light text-muted-foreground text-sm">
                    los márgenes dependerán de su configuración de impresión
                  </span>
                </p>
              </>
            ) }
          </section>
          {preview !== null &&
          previewHeight > 0 &&
          previewWidth > 0 &&
          parseInt(sheets) > 0 ? (
            <Preview
              imageUrl={preview[0].preview}
              width={previewWidth}
              height={previewHeight}
              horizontal_sheets={parseInt(sheets)}
              onClose={() => { newPrompt({callback: handleClose, text: "Esta acción reiniciará el formulario. ¿Desea continuar?"}) }}
              disabled={methods.formState.isSubmitting}
              showClose={!methods.formState.isSubmitSuccessful}
            />
          ) : (
            <ImageForm />
          )}

          {fileUrl !== "" && (
            <div className="flex items-center justify-center gap-2">
              <Button asChild className="w-full">
                <a href={fileUrl} download={"poster"}>
                  Descargar
                  <DownloadIcon />
                </a>
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => 
                  newPrompt({callback: handleClose, text: "Esta acción reiniciará el formulario. ¿Desea continuar?"})
                }
              >
                Reiniciar
                <RotateCcw />
              </Button>
            </div>
          )}
        </div>
        {images.length > 0 && fileUrl == "" && <SubmitSection />}
      </FormProvider>
    </main>
  );
}

export default App;
