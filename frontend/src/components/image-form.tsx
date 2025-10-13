import {useFormContext } from "react-hook-form";
import DropzoneInput from "./drop-zone";
import {
  FieldDescription,
  FieldLegend,
  FieldSet,
} from "./ui/field";




const ImageForm = () => {

  // const [downloadLink, setDownloadLink] = React.useState<string | undefined>(
  //   undefined
  // );
    const methods = useFormContext();

  return (

      <form
        className="flex flex-col w-full items-center gap-4"
      >
        <FieldSet>
          <FieldLegend>Upload Image</FieldLegend>
          <FieldDescription>
            Upload the image you want to make a poster of
          </FieldDescription>
          <DropzoneInput control={methods.control} name="image" />
        </FieldSet>

      </form>
  );
};
export default ImageForm;

