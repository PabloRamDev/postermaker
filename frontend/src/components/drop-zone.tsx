import React from "react";
import { Controller } from "react-hook-form";
import Dropzone from "react-dropzone";
import { Upload } from "lucide-react";
import Thumbnail from "./thumbnail";


interface extendedFile extends File {
  preview: string;
} 
export default function DropzoneInput ({ control, name }) {

  const [file, setFile] = React.useState<extendedFile[]>([])

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <Dropzone multiple={false} onDrop={acceptedFiles => {
          onChange(acceptedFiles)
          setFile(acceptedFiles.map(file => Object.assign(file, {preview: URL.createObjectURL(file)})))
        }
          }>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="flex flex-col items-center justify-center p-8 border-2 border-dashed">
              <input {...getInputProps()} onBlur={onBlur} />
              <Upload />
              <p>Drag 'n' drop some files here, or click to select files</p>
              {value && value.map((file) => (
                <div key={file.path}>{file.path}</div>
              ))}
                 {file.map(thumb => <Thumbnail key={thumb.preview}{...thumb} />)}
            </div>
          )}
             
        </Dropzone>
        
      )}

    />
  );
};
