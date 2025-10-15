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

  const { fileUrl, preview, previewHeight, previewWidth, setReset } =
    useFileStore();

  return (
    <main className="flex h-screen w-full min-h-screen max-w-screen">
      <FormProvider {...methods}>
        <div className="flex flex-col h-full items-center w-full gap-8 px-8 py-20">
          <section className="flex flex-col justify-center w-full gap-2 items-center">
            <h1 className="text-5xl font-black">P O S T E R   M A K E R</h1>
            {!methods.formState.isDirty && !methods.formState.isSubmitSuccessful ? (
              <p className="text-center text-xl font-semibold">
                Sube una imagen y crea un poster en múltiples hojas facilmente
              </p>
            ) : (
              <>
                <p className=" flex flex-col text-center text-xl font-semibold">
                  Previsualización
                  <span className="font-light text-muted-foreground text-sm">
                    los márgenes dependerán de su configuración de impresión
                  </span>
                </p>
                <Button
                  variant="destructive"
                  
                  onClick={() => {
                    methods.reset();
                    setReset();
                  }}
                >
                  Reiniciar
                  <RotateCcw />
                </Button>
              </>
            )}
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
            />
          ) : (
            <ImageForm />
          )}

          {fileUrl !== "" && (
            <a
              className="flex w-fit justify-center align-center px-4 py-2 gap-2 font-semibold bg-muted text-sm rounded-md"
              href={fileUrl}
              download={"poster"}
            >
              <span>Descargar</span>
              <DownloadIcon />
            </a>
          )}
        </div>
        {images.length > 0 && fileUrl == "" && <SubmitSection />}
      </FormProvider>
    </main>
  );
}

export default App;
