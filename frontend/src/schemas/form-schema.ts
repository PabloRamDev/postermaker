
import * as z from "zod";

const formSchema = z.object({
  image: z.file("You must upload an image").array(),
  sheets_horizontal: z.number()
});

export {formSchema}