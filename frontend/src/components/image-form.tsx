import * as React from "react";
import { useForm } from "react-hook-form";
import DropzoneInput from "./drop-zone";
import { DownloadIcon } from "lucide-react";
import { Button } from "./ui/button";

const ImageForm = () => {
  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      sheets_horizontal : 1,
      image: []
    }
  });
  const [downloadLink, setDownloadLink] = React.useState<string | undefined>(
    undefined
  );

  const onSubmit = async (data) => {
    const formData = new FormData();
    const image = data.image[0];
    formData.append("image", image);
    formData.append("sheets_horizontal", data.sheets_horizontal)
    await fetch(`http://127.0.0.1:8000/api/image-pdf/`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                // When no more data needs to be consumed, close the stream
                if (done) {
                  controller.close();
                  return;
                }
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                return pump();
              });
            }
          },
        });
      })
      // Create a new response out of the stream
      .then((stream) => new Response(stream))
      // Create an object URL for the response
      .then((response) => response.blob())
      .then((blob) => URL.createObjectURL(blob))
      // Update image
      .then((url) => setDownloadLink(url))
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
        <DropzoneInput control={control} name="image" />

          <div className="flex items-center">
        <label htmlFor="sheets">Number of sheets</label>
        <input
          {...register("sheets_horizontal", { required: true})}
          type="number"
          min={1}
          max={3}
        />
          </div>

        <Button type="submit">
          Submit
        </Button>
      </form>
      {downloadLink && <a className="flex justify-center items-center  p-2 bg-muted w-auto rounded-sm " href={downloadLink} download="my-poster.pdf">
        <span>Download</span>
        <DownloadIcon />
        </a>}
    </>
  );
};
export default ImageForm;
