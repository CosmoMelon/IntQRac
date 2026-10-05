import { BrowserQRCodeReader } from '@zxing/browser';
const reader = new BrowserQRCodeReader();

async function decodeWithJsQR(url: string): Promise<string> {
  const image = new Image();
  image.src = url;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Image decoding is not available in this browser.');
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const { default: jsQR } = await import('jsqr');
  const result = jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: 'attemptBoth' });
  if (!result) throw new Error('No readable QR code was found in this image.');
  return result.data;
}

export async function decodeImageUrl(url: string): Promise<string> {
  try { return (await reader.decodeFromImageUrl(url)).getText(); }
  catch { return decodeWithJsQR(url); }
}
export async function decodeImageFile(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try { return await decodeImageUrl(url); } finally { URL.revokeObjectURL(url); }
}
export async function scanCamera(video: HTMLVideoElement, onResult: (raw: string) => void) {
  return reader.decodeFromVideoDevice(undefined, video, (result, _error, controls) => {
    if (result) { controls.stop(); onResult(result.getText()); }
  });
}
