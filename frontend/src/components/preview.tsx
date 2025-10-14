import React from "react";

interface PreviewProps {
  imageUrl: string;
  width: number;
  height: number; 
  horizontal_sheets: number;
}

const wRatio = 1.204;
const hRatio = 1;

export default function Preview({
  imageUrl,
  width,
  height,
  horizontal_sheets,
}: PreviewProps) {
  const imageAspectRatio = width / height;
  const side = 240 / horizontal_sheets;
  let pageWidth: number;
  let pageHeight: number;

  if (imageAspectRatio > 1) {
    pageWidth = side * wRatio;
    pageHeight = side * hRatio;
  } else {
    pageWidth = side * hRatio;
    pageHeight = side * wRatio;
  }

  const previewWidth = pageWidth * horizontal_sheets;
  const previewHeight = previewWidth / imageAspectRatio;
  const vertical_sheets = Math.max(1, Math.ceil(previewHeight / pageHeight));

  const totalGridWidth = horizontal_sheets * pageWidth;
  const totalGridHeight = vertical_sheets * pageHeight;
  const gridAspectRatio = totalGridWidth / totalGridHeight;


  let scaledPreviewWidth: number;
  let scaledPreviewHeight: number;
  if (imageAspectRatio > gridAspectRatio) {

    scaledPreviewWidth = totalGridWidth;
    scaledPreviewHeight = totalGridWidth / imageAspectRatio;
  } else {

    scaledPreviewHeight = totalGridHeight;
    scaledPreviewWidth = totalGridHeight * imageAspectRatio;
  }

  const offsetX = (totalGridWidth - scaledPreviewWidth) / 2;
  const offsetY = (totalGridHeight - scaledPreviewHeight) / 2;

  const totalDivs = horizontal_sheets * vertical_sheets;
  const divs = Array.from({ length: totalDivs });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${horizontal_sheets}, ${pageWidth}px)`,
        gridAutoRows: `${pageHeight}px`,
        width: totalGridWidth,
        height: totalGridHeight,
        gap: "2px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {divs.map((_, index) => {
        const col = index % horizontal_sheets;
        const row = Math.floor(index / horizontal_sheets);

        const tileLeft = col * pageWidth;
        const tileTop = row * pageHeight;

        const imageOffsetWithinTileX = tileLeft - offsetX;
        const imageOffsetWithinTileY = tileTop - offsetY;

        const backgroundPosX = -Math.round(imageOffsetWithinTileX);
        const backgroundPosY = -Math.round(imageOffsetWithinTileY);

        return (
          <div
            key={index}
            style={{
                backgroundColor: "white",
              width: `${pageWidth}px`,
              height: `${pageHeight}px`,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${scaledPreviewWidth}px ${scaledPreviewHeight}px`,
              backgroundPosition: `${backgroundPosX}px ${backgroundPosY}px`,
              backgroundRepeat: "no-repeat",
              boxSizing: "border-box",
              border: "1px solid #ccc",
              overflow: "hidden",
              backgroundClip: "content-box",
              imageRendering: "crisp-edges", // helps with sharp edges
              position: "relative",
            }}
          >

          </div>
        );
      })}
    </div>
  );
}
