
export interface dropFile extends File {
  preview: string;
}

export default function Thumbnail(file : dropFile) {
  return (
    <div key={file.name} className="flex rounded-sm border-2 border-muted p-4 w-40 h-40">
      <div className="flex">
        <img
          src={file.preview}
          className="block w-auto h-auto"
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  )
}
