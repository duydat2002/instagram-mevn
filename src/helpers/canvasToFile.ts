export function canvasToFile(canvas: HTMLCanvasElement, fileName: string): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], `${fileName}.png`, { type: "image/png" }));
      } else {
        reject(new Error("Failed to convert canvas to file"));
      }
    }, "image/png");
  });
}
