import { FormProvider } from "react-hook-form";
import Header from "./components/layout/header";
import { usePosterForm } from "./hooks/use-poster-form";
import { useFileStore } from "./store/file-store";
import TextSection from "./components/text-section";
import PosterPreviewSection from "./components/poster-preview-section";
import ImageForm from "./components/image-form";
import DownloadActions from "./components/download-actions";
import SubmitSection from "./components/submit-section";

export default function App() {
  const { methods, handleResetWithPrompt } = usePosterForm();
  const { fileUrl, preview, previewHeight, previewWidth } = useFileStore();
  
  const image = methods.watch("image");
  const sheets = methods.watch("sheets_horizontal");
  
  const showPreview = preview && previewHeight > 0 && previewWidth > 0 && sheets > 0;
  const hasImage = image?.length > 0;
  
  return (
    <main className="flex flex-col items-center justify-center frosted-backdrop h-dvh w-dvw overflow-hidden">
      <Header />
      <FormProvider {...methods}>
        <div className="flex grow min-h-0 w-full">
          <div className="flex flex-col items-center w-full gap-8 py-16 overflow-y-auto">
            <TextSection isDirty={methods.formState.isDirty} isSubmitSuccessful={methods.formState.isSubmitSuccessful} />
            
            {showPreview ? (
              <PosterPreviewSection
                preview={preview[0].preview}
                width={previewWidth}
                height={previewHeight}
                sheets={sheets}
                onClose={handleResetWithPrompt}
                isSubmitting={methods.formState.isSubmitting}
                showClose={!methods.formState.isSubmitSuccessful}
              />
            ) : (
              <ImageForm />
            )}
            
            {fileUrl && (
              <DownloadActions 
                fileUrl={fileUrl} 
                onReset={handleResetWithPrompt} 
              />
            )}
          </div>
          
          {hasImage && <SubmitSection />}
        </div>
      </FormProvider>
    </main>
  );
}