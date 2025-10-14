import {useFormContext } from "react-hook-form";
import DropzoneInput from "./drop-zone";




const ImageForm = () => {

  // const [downloadLink, setDownloadLink] = React.useState<string | undefined>(
  //   undefined
  // );
    const methods = useFormContext();

  return (

      <form
        className="flex flex-col w-full items-center gap-8"
      >
          <DropzoneInput control={methods.control} name="image" />

      </form>
  );
};
export default ImageForm;

