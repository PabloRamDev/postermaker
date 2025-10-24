import { DownloadIcon, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

interface DownloadActionsProps {
  fileUrl: string;
  onReset: () => void;
}

export default function DownloadActions({ fileUrl, onReset }: DownloadActionsProps) {
  return (
    <div className="flex w-auto items-center justify-center gap-2">
      <Button asChild className="flex-1">
        <a href={fileUrl} download="poster.pdf">
          Descargar
          <DownloadIcon />
        </a>
      </Button>
      <Button variant="destructive" className="flex-1" onClick={onReset}>
        Reiniciar
        <RotateCcw />
      </Button>
    </div>
  );
}