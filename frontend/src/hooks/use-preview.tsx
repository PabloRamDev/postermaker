import { type MouseEvent } from "react";
import Thumbnail from "@/components/thumbnail";
import { type extendedFile } from "@/store/file-store"

const usePreview = () => {


    const createPreview = (preview: extendedFile[], onClose: (e: MouseEvent<HTMLButtonElement>) => void) => {

        return (
                preview?.map((thumb) => (
                <Thumbnail onClose={onClose} key={thumb.preview} {...thumb} />
                ))
        )}


        return [ createPreview ]
    
}

export { usePreview }