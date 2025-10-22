import { type MouseEvent } from "react";
import { X } from "lucide-react";

export interface dropFile extends File {
  preview: string;
  onClose: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function Thumbnail(file: dropFile) {

  return (
    <div
      key={file.name}
      className="relative flex rounded-sm border-2 border-muted p-4 w-40 h-40"
    >
      <button
        className="absolute flex items-center justify-center top-2 right-2 w-6 h-6 cursor-pointer rounded-full hover:bg-destructive duration-150 bg-muted border-muted-foreground border-1"
        onClick={file.onClose}
      >
        <X />
      </button>
      <div className="flex items-center justify-center">
        <img
          src={file.preview}
          className="block w-auto h-auto"
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  );
}
