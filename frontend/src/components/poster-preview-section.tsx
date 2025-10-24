import { useFileStore } from "@/store/file-store";
import { useMediaQuery } from "react-responsive";
import Preview from "./preview";
import { Button } from "./ui/button";
import { ArrowUpFromLineIcon } from "lucide-react";

interface PosterPreviewSectionProps {
  preview: string;
  width: number;
  height: number;
  sheets: number;
  onClose: () => void;
  isSubmitting: boolean;
  showClose: boolean;
}

export default function PosterPreviewSection({ 
  preview, 
  width, 
  height, 
  sheets,
  onClose,
  isSubmitting,
  showClose 
}: PosterPreviewSectionProps) {
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const { setOpen } = useFileStore();
  
  return (
    <>
      <Preview
        imageUrl={preview}
        width={width}
        height={height}
        horizontal_sheets={sheets}
        onClose={onClose}
        disabled={isSubmitting}
        showClose={showClose}
      />
      {isTabletOrMobile && (
        <Button variant="outline" onClick={setOpen}>
          Abrir formulario
          <ArrowUpFromLineIcon />
        </Button>
      )}
    </>
  );
}