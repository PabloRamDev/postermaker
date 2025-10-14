import ImageForm from "./components/image-form";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitSection from "./components/submit-section";
import * as z from "zod";
import { formSchema } from "./schemas/form-schema";
import { useFileStore } from "./store/file-store";
import { DownloadIcon } from "lucide-react";

function App() {
  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sheets_horizontal: "",
      image: [],
    },
  });

  const images = methods.watch("image");
  const { fileUrl } = useFileStore();

  return (
    <main className="flex h-screen w-full min-h-screen max-w-screen">
      <FormProvider {...methods}>
        <div className="flex flex-col h-full items-center w-full gap-8 px-8 py-20">
          <section className="flex flex-col justify-center w-full gap-2 items-center">
            <h1 className="text-5xl font-bold">POSTER MAKER</h1>
            <p className="text-center text-xl font-semibold">
              Sube una imagen y crea un poster en múltiples hojas facilmente
            </p>
          </section>
          <ImageForm />
          {fileUrl !== "" && (
            <a className="flex w-fit justify-center align-center px-4 py-2 gap-2 font-semibold bg-muted  rounded-md" href={fileUrl} download={"poster"}>
              <span>
              Descargar
              </span>
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
