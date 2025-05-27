// lib/crop-image.ts

export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Creates an image element from a source URL.
 * @param {string} url - The image source URL.
 * @returns {Promise<HTMLImageElement>} - A promise that resolves with the loaded image element.
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    // Setting crossOrigin is important if the image is from a different domain
    // and you want to draw it on a canvas without tainting it.
    // For blob URLs or data URLs, this is not strictly necessary but doesn't harm.
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

/**
 * Rotates an image.
 * @param {HTMLImageElement} image - The image to rotate.
 * @param {number} rotation - The rotation angle in degrees.
 * @returns {Promise<string>} - A promise that resolves with a data URL of the rotated image.
 */
// function getRadianAngle(degreeValue: number) {
//   return (degreeValue * Math.PI) / 180;
// }

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {HTMLImageElement} image - Image File url
 * @param {Area} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<string | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = (rotation * Math.PI) / 180;

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  // ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1); // Not using flip here
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As a blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        console.error("Canvas is empty");
        reject(new Error("Canvas is empty"));
        return;
      }
      // It's good practice to revoke the blob URL when it's no longer needed
      // In this case, the caller ImageUploadWithCrop will manage the blob URL it receives.
      resolve(URL.createObjectURL(blob));
    }, "image/png"); // You can change the format here if needed, e.g., 'image/jpeg'
    // For avatars, PNG is often preferred for transparency, but JPEG can be smaller.
  });
}

/**
 * Utility to calculate the size of the bounding box of a rotated image.
 * @param {number} width - The original image width.
 * @param {number} height - The original image height.
 * @param {number} rotation - The rotation angle in degrees.
 * @returns {{ width: number, height: number }} - The width and height of the bounding box.
 */
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Converts a URL (blob URL or data URL) to a File object.
 * @param {string} url - The URL of the image.
 * @param {string} filename - The desired filename for the new File object.
 * @param {string} [originalMimeType] - Optional: The original MIME type of the image.
 * @returns {Promise<File>} - A promise that resolves with the File object.
 */
export async function urlToFile(
  url: string,
  filename: string,
  originalMimeType?: string | null
): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();

  // Determine the MIME type for the new File
  // 1. Use originalMimeType if provided and valid.
  // 2. Fallback to the blob's type if originalMimeType is not suitable.
  // 3. Default if neither is available.
  let finalMimeType = originalMimeType;

  if (
    !finalMimeType ||
    typeof finalMimeType !== "string" ||
    !finalMimeType.includes("/")
  ) {
    finalMimeType = blob.type; // Use the blob's detected type
  }

  // If still no valid MIME type, use a generic one.
  // For images, 'image/png' or 'image/jpeg' are common, but blob.type should usually be correct.
  if (
    !finalMimeType ||
    typeof finalMimeType !== "string" ||
    !finalMimeType.includes("/")
  ) {
    if (filename.toLowerCase().endsWith(".png")) {
      finalMimeType = "image/png";
    } else if (
      filename.toLowerCase().endsWith(".jpg") ||
      filename.toLowerCase().endsWith(".jpeg")
    ) {
      finalMimeType = "image/jpeg";
    } else if (filename.toLowerCase().endsWith(".webp")) {
      finalMimeType = "image/webp";
    } else if (filename.toLowerCase().endsWith(".gif")) {
      finalMimeType = "image/gif";
    } else {
      finalMimeType = "application/octet-stream"; // Fallback for unknown types
    }
  }

  return new File([blob], filename, { type: finalMimeType });
}
