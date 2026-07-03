"use client";

import { useState } from "react";

import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";

import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";

export type GalleryPhotoProps = {
  src: string,
  width: number,
  height: number
};

export default function GalleryAlbum({ imgs, isDemo }: { imgs: GalleryPhotoProps[], isDemo?: boolean }) {
  const [index, setIndex] = useState(-1);

  return (
    <>
      {
        isDemo && (
          <style jsx global>{`
          .react-photo-album--image {
            object-fit: cover !important;
            width: 100% !important;
            height: 100% !important;
          }
        `}</style>
        )
      }

      <PhotoAlbum
        layout="rows"
        photos={imgs}
        targetRowHeight={300}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        slides={imgs}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
    </>
  );
}