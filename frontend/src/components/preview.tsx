import { X } from "lucide-react";

interface PreviewProps {
  imageUrl: string;
  width: number;
  height: number;
  horizontal_sheets: number;
  onClose: () => void;
  disabled: boolean;
  showClose: boolean;
}

const wRatio = 1.204; // Letter paper aspect ratio (width / height)
const hRatio = 1;

export default function Preview({
  imageUrl,
  width,
  height,
  horizontal_sheets,
  onClose,
  disabled,
  showClose
}: PreviewProps) {
  const imageAspectRatio = width / height; // >1 = landscape
  const landscape = imageAspectRatio >= 1;


  let side: number;
  if (landscape) {
    side = 300 / horizontal_sheets;
  } else {

    const estimated_vertical_sheets = Math.ceil(horizontal_sheets / imageAspectRatio);
    side = 300 / estimated_vertical_sheets;
  }

  let pageWidth: number;
  let pageHeight: number;
  if (landscape) {
    pageWidth = side * wRatio;
    pageHeight = side * hRatio;
  } else {
    pageWidth = side * hRatio;
    pageHeight = side * wRatio;
  }


  let previewWidth = pageWidth * horizontal_sheets;
  let previewHeight = previewWidth / imageAspectRatio;


  let vertical_sheets = Math.ceil(previewHeight / pageHeight);

  if (horizontal_sheets === 1) {
    vertical_sheets = 1;
    previewWidth = pageWidth;
    previewHeight = pageHeight;
  }

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
        backgroundColor: "#eee",
      }}
    >
      {
        showClose &&  <button
              className="absolute flex items-center justify-center top-2 right-2 w-6 h-6 cursor-pointer rounded-full hover:bg-destructive duration-150 bg-muted border-muted-foreground border-1"
              onClick={onClose}
              disabled={disabled}
            >
              <X />
            </button>
      }

      {divs.map((_, index) => {
        const col = index % horizontal_sheets;
        const row = Math.floor(index / horizontal_sheets);

        const tileLeft = col * pageWidth;
        const tileTop = row * pageHeight;

        const backgroundPosX = -Math.round(tileLeft - offsetX);
        const backgroundPosY = -Math.round(tileTop - offsetY);

        return (
          <div
            key={index}
            style={{
              width: `${pageWidth}px`,
              height: `${pageHeight}px`,
              backgroundColor: "white",
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${scaledPreviewWidth}px ${scaledPreviewHeight}px`,
              backgroundPosition: `${backgroundPosX}px ${backgroundPosY}px`,
              backgroundRepeat: "no-repeat",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              overflow: "hidden",
              backgroundClip: "border-box",
              imageRendering: "crisp-edges",
            }}
          />
        );
      })}
    </div>
  );
}
