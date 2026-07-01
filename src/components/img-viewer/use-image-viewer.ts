import { create } from "zustand";

type ImageViewerState = {
  image: string | null;
  openImgViewer: (src: string) => void;
  closeImgViewer: () => void;
};

export const useImageViewer = create<ImageViewerState>((set) => ({
  image: null,

  openImgViewer: (src) => set({ image: src }),
  closeImgViewer: () => set({ image: null }),
}));