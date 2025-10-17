import { create } from "zustand";

export interface extendedFile extends File {
  preview: string;
}

interface fileStore {
  uploadProgress: number;
  open: boolean;
  setOpen: () => void;
  setClose: () => void;
  fileUrl: string;
  preview: extendedFile[];
  previewHeight: number;
  previewWidth: number;
  setUploadProgress: (percentage: number) => void;
  setFileUrl: (url: string) => void;
  setPreview: (file: extendedFile[]) => void;
  setWidthHeight: (width: number, height: number) => void;
  setReset: () => void;
}

const useFileStore = create<fileStore>((set) => ({
  uploadProgress: 0,
  open: false,
  fileUrl: "",
  preview: null,
  previewHeight: 0,
  previewWidth: 0,
  setUploadProgress: (percentage) => set({ uploadProgress: percentage }),
  setFileUrl: (url) => set({ fileUrl: url }),
  setPreview: (file) => set({ preview: file, open: true }),
  setWidthHeight: (width, height) =>
    set({ previewWidth: width, previewHeight: height }),
  setOpen: () => set({open: true }),
  setClose: () => set({open: false}),
  setReset: () => set({  uploadProgress: 0,
  fileUrl: "",
  preview: null,
  previewHeight: 0,
  previewWidth: 0,})
}));
export { useFileStore };
