/* eslint-disable @typescript-eslint/no-explicit-any */
import { type MouseEvent } from "react";
import { Controller } from "react-hook-form";
import Dropzone from "react-dropzone";
import { Upload } from "lucide-react";
import Thumbnail from "./thumbnail";
import { useFileStore, type extendedFile } from "@/store/file-store";


export default function DropzoneInput({ control, name }) {
  
  const {setFileUrl, preview, setPreview, setWidthHeight} = useFileStore()

  const handleImageLoad = (e: any) => {
        const { naturalHeight, naturalWidth } = e.target;
        setWidthHeight(naturalWidth, naturalHeight);
    };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Dropzone
          multiple={false}
          onDrop={(acceptedFiles) => {
            onChange(acceptedFiles);
            setPreview(
              acceptedFiles.map((file) => 
                {
                  const img = new Image();
                  img.src = URL.createObjectURL(file);
                  img.onload = handleImageLoad
 
                  return Object.assign(file, { preview: img.src, width: img.naturalWidth, height: img.naturalHeight })
                }
                
             
              ) as extendedFile[]
            );
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="flex flex-col items-center justify-center p-8 gap-4 border-2 rounded-md border-dashed w-full lg:w-1/2 cursor-pointer"
            >
              <input {...getInputProps()} onBlur={onBlur} />

              {preview == null && (
                <>
                  <Upload />
                  <p className="text-center">Haz click aquí o arrastra un archivo</p>
                </>
              )}
              {value &&
                value.map((file) => <div key={file.path}>{file.path}</div>)}
              {preview?.map((thumb) => (
                <Thumbnail onClose={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onChange(() => []); setPreview(null); setFileUrl("") }} key={thumb.preview} {...thumb} />
              ))}
            </div>
          )}
        </Dropzone>
      )}
    />
  );
}
