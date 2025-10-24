/* eslint-disable @typescript-eslint/no-explicit-any */
import { type MouseEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Dropzone from "react-dropzone";
import { Upload } from "lucide-react";
import { useFileStore, type extendedFile } from "@/store/file-store";
import { usePreview } from "@/hooks/use-preview";

export default function DropzoneInput() {
  const { setFileUrl, setOpen ,preview, setPreview, setWidthHeight } = useFileStore();
  const { control } = useFormContext();

  const handleImageLoad = (e: any) => {
    const { naturalHeight, naturalWidth } = e.target;
    setWidthHeight(naturalWidth, naturalHeight);
  };

  const [createPreview] = usePreview();

  return (
    <Controller
      control={control}
      name={"image"}
      render={({ field: { onChange, onBlur, value } }) => (
        <Dropzone
          multiple={false}
          onDrop={(acceptedFiles) => {
            onChange(acceptedFiles);
            setPreview(
              acceptedFiles.map((file) => {
                const img = new Image();
                const objectUrl = URL.createObjectURL(file);

                img.src = objectUrl;
                img.onload = handleImageLoad;
                return Object.assign(file, {
                  preview: img.src,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
              }) as extendedFile[]
            );
            setOpen();
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="flex flex-col items-center justify-center p-8 gap-4 border-2 rounded-md bg-white/5 frosted-backdrop border-dashed w-full lg:w-1/2 cursor-pointer"
            >
              <input {...getInputProps()} onBlur={onBlur} />

              {preview == null && (
                <>
                  <Upload />
                  <p className="text-center">
                    Haz click aquí o arrastra un archivo
                  </p>
                </>
              )}
              {value &&
                value.map((file) => <div key={file.path}>{file.path}</div>)}
              {createPreview(preview, (e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onChange(() => []);
                setPreview(null);
                setFileUrl("");
              })}
            </div>
          )}
        </Dropzone>
      )}
    />
  );
}
