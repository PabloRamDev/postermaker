import ImageForm from "./components/image-form";
import * as z from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitSection from "./components/submit-section";

const formSchema = z.object({
  image: z.file("You must upload an image").array(),
  sheets_horizontal: z.string().regex(/^\d+$/, {
    message: "String must contain only digits.",
  }),
});

function App() {
  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sheets_horizontal: "",
      image: [],
    },
  });

  const images = methods.watch("image");

  return (
    <main className="container flex h-screen w-screen min-h-screen min-w-screen">
      <FormProvider {...methods}>
        <div className="flex flex-col h-full w-full gap-8 p-8">
          <section className="flex flex-col justify-center w-full gap-2 items-center">
            <h1 className="text-5xl font-bold">POSTER MAKER</h1>
            <p className="text-center">
              Make simple multi sheet posters in seconds
            </p>
          </section>
                      <ImageForm />
        </div>
        {images.length > 0 && <SubmitSection />}
      </FormProvider>
    </main>
  );
}

export default App;
