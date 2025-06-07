// components/ui/image-upload-with-crop.tsx
"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";
import {
  Dialog as CropDialog,
  DialogContent as CropDialogContent,
  DialogHeader as CropDialogHeader,
  DialogTitle as CropDialogTitle,
  DialogFooter as CropDialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import getCroppedImg, { urlToFile } from "@/lib/crop-image";
import { RotateCcw, ImageUp, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";

import { FileUpload, FileUploadRef } from "@/components/ui/file-upload";
import Image from "next/image";

interface ImageUploadWithCropProps {
  onFileCropped: (file: File | null) => void;
  accept?: string;
  aspectRatio?: number;
  initialImagePreviewUrl?: string | null;
  circularCrop?: boolean;
}

export function ImageUploadWithCrop({
  onFileCropped,
  accept = "image/jpeg, image/png, image/webp, image/gif",
  aspectRatio = 1,
  initialImagePreviewUrl = null,
  circularCrop = false,
}: ImageUploadWithCropProps) {
  const [originalFileFromSelection, setOriginalFileFromSelection] =
    useState<File | null>(null);
  const [imageSrcForCropper, setImageSrcForCropper] = useState<string | null>(
    null
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null); // State to track if crop was applied

  const [displayImagePreview, setDisplayImagePreview] = useState<string | null>(
    null
  );
  const [isCroppingModalOpen, setIsCroppingModalOpen] = useState(false);

  const fileUploadComponentRef = useRef<FileUploadRef>(null);

  // const sourceMime =
  //   originalFileFromSelection?.type ||
  //   (initialImagePreviewUrl && initialImagePreviewUrl.startsWith("data:image/")
  //     ? initialImagePreviewUrl.substring(5, initialImagePreviewUrl.indexOf(";"))
  //     : null) ||
  //   "image/png"; // A bit more robust mime detection

  const displayBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // THIS IS LIKELY AROUND LINE 58 or related to it
    // Initialize display preview with the initial image URL
    setDisplayImagePreview(initialImagePreviewUrl);

    if (initialImagePreviewUrl && initialImagePreviewUrl.startsWith("blob:")) {
      displayBlobUrlRef.current = initialImagePreviewUrl;
    } else {
      displayBlobUrlRef.current = null;
    }

    // Cleanup function:
    return () => {
      if (
        displayBlobUrlRef.current &&
        displayBlobUrlRef.current !== initialImagePreviewUrl
      ) {
        URL.revokeObjectURL(displayBlobUrlRef.current);
        displayBlobUrlRef.current = null;
      }
    };
  }, [initialImagePreviewUrl]);

  useEffect(() => {
    // Initialize display preview with the initial image URL
    setDisplayImagePreview(initialImagePreviewUrl);
    // Ensure the ref is null if the initial URL is not a blob
    if (initialImagePreviewUrl && initialImagePreviewUrl.startsWith("blob:")) {
      // This case shouldn't happen with initialImagePreviewUrl from server
      // But handling defensively
      displayBlobUrlRef.current = initialImagePreviewUrl;
    } else {
      displayBlobUrlRef.current = null;
    }

    // Cleanup function: revoke the display blob URL if the component unmounts
    // or if initialImagePreviewUrl changes (meaning a new image is loaded from server)
    return () => {
      if (
        displayBlobUrlRef.current &&
        displayBlobUrlRef.current !== initialImagePreviewUrl
      ) {
        URL.revokeObjectURL(displayBlobUrlRef.current);
        displayBlobUrlRef.current = null;
      }
      // Also cleanup any cropper source if it was a blob/data URL
      // This is handled by the modal close handler more immediately, but good for unmount
      // if (imageSrcForCropper && imageSrcForCropper.startsWith('blob:')) { URL.revokeObjectURL(imageSrcForCropper); }
      // Data URLs don't need explicit revocation.
    };
  }, [initialImagePreviewUrl]); // Re-run this effect if the initial server URL changes

  // Effect to handle cleanup of imageSrcForCropper when the modal closes
  // or when applyCrop sets it to null
  useEffect(() => {
    // This cleanup fires BEFORE the state update commits in the next render cycle
    // or on unmount. If imageSrcForCropper WAS a blob, revoke it.
    // This is complex with re-cropping. Let's simplify the state flow.
    // Let's rely on explicit cleanup in modal close and applyCrop
    // If imageSrcForCropper was a blob created from originalFileFromSelection, revoke it
    // once it's no longer needed by the cropper.
    // If imageSrcForCropper was displayImagePreview blob (re-cropping),
    // that blob is managed by displayBlobUrlRef.
  }, [imageSrcForCropper]); // Depend on imageSrcForCropper

  const handleFileSelectedByFileUpload = useCallback(
    (selectedFiles: File[]) => {
      if (selectedFiles && selectedFiles.length > 0) {
        const file = selectedFiles[0];
        setOriginalFileFromSelection(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrcForCropper(reader.result as string); // This is a data URL (string)
          setIsCroppingModalOpen(true);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
          setCroppedAreaPixels(null); // Reset cropped area when new file selected
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixelsValue: Area) => {
      setCroppedAreaPixels(croppedAreaPixelsValue);
    },
    []
  );

  const applyCrop = async () => {
    if (!imageSrcForCropper || !croppedAreaPixels) {
      toast.error("Erreur de rognage", {
        description: "Données de rognage manquantes.",
      });
      return;
    }

    const sourceName =
      originalFileFromSelection?.name ||
      initialImagePreviewUrl?.substring(
        initialImagePreviewUrl.lastIndexOf("/") + 1
      ) ||
      "image.png";
    // The mime type is better determined from the blob itself or source image if possible
    // For simplicity, using a common default or original file type if available
    const sourceMime = originalFileFromSelection?.type || "image/png";

    try {
      // getCroppedImg returns a blob URL
      const croppedImageBlobUrl = await getCroppedImg(
        imageSrcForCropper,
        croppedAreaPixels
      );

      if (croppedImageBlobUrl) {
        // Revoke the previously displayed blob URL before setting the new one
        if (displayBlobUrlRef.current) {
          URL.revokeObjectURL(displayBlobUrlRef.current);
        }
        // Set the new display preview URL and update the ref
        setDisplayImagePreview(croppedImageBlobUrl);
        displayBlobUrlRef.current = croppedImageBlobUrl;

        // Convert the blob URL to a File object to pass to the parent
        const croppedFile = await urlToFile(
          croppedImageBlobUrl,
          `cropped_${sourceName}`, // Use a distinct name
          sourceMime // Pass original mime type or infer if possible
        );

        onFileCropped(croppedFile); // Pass the File object up to the parent

        // Cleanup cropper states
        setImageSrcForCropper(null); // Clear the source used by the cropper
        setCroppedAreaPixels(null); // Mark as applied/cleared

        setIsCroppingModalOpen(false); // Close the modal

        // If the original source for the cropper was a blob URL created here (e.g., from re-cropping a previous blob)
        // ensure it's revoked. Data URLs don't need explicit revoke.
        // In the simplified re-crop logic below, imageSrcForCropper will be displayImagePreview,
        // and its cleanup is handled by the displayBlobUrlRef logic.
        // If using originalFileFromSelection created a blob URL for the cropper source (not implemented this way currently)
        // you'd need to manage that blob URL with another ref and revoke it here.
        // With current logic (data URL from initial file, or displayImagePreview from re-crop),
        // the primary blob to manage is the one for displayImagePreview.
      }
    } catch (e) {
      console.error("Erreur lors du rognage:", e);
      toast.error("Erreur de rognage", {
        description: "Impossible de générer l'image rognée.",
      });
      onFileCropped(null);
      // On error, clear temporary states but keep existing preview
      setImageSrcForCropper(null);
      setCroppedAreaPixels(null);
      setIsCroppingModalOpen(false);
      // Do NOT clear displayImagePreview or revoke its potential blob here on crop error
    }
  };

  const handleReCropOrEdit = () => {
    // Use the currently displayed image as the source for re-cropping
    // This works whether it's the initial server URL or a previously cropped blob URL
    const sourceToCrop = displayImagePreview;

    if (sourceToCrop) {
      setImageSrcForCropper(sourceToCrop); // Set the source for the cropper
      setIsCroppingModalOpen(true); // Open the modal
      setCrop({ x: 0, y: 0 }); // Reset crop/zoom
      setZoom(1);
      setCroppedAreaPixels(null); // Reset cropped area state
      // Note: If sourceToCrop was a blob URL (from displayImagePreview),
      // we are passing it to the cropper. It's the same blob URL managed by displayBlobUrlRef.
      // We do NOT revoke it here as it's still needed by the cropper.
    } else {
      toast.info("Aucune image source", {
        description: "Impossible de trouver une image à rogner.",
      });
    }
  };

  // Clears the selection entirely, reverting to initial state (or empty)
  const clearSelection = (notifyParent = true, change = false) => {
    // Revoke the current display blob URL if it exists
    if (displayBlobUrlRef.current) {
      URL.revokeObjectURL(displayBlobUrlRef.current);
      displayBlobUrlRef.current = null;
    }


    // Revoke the cropper source if it was a blob (less likely with simplified logic)
    // if (imageSrcForCropper && imageSrcForCropper.startsWith('blob:')) {
    //     URL.revokeObjectURL(imageSrcForCropper);
    // }
    // Data URLs (imageSrcForCropper from initial file select) don't need explicit revoke.

    setOriginalFileFromSelection(null);
    setImageSrcForCropper(null);
    setDisplayImagePreview(change ? null : initialImagePreviewUrl); // Revert to initial URL
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null); // Clear cropped area state
    setIsCroppingModalOpen(false); // Ensure modal is closed
    if (notifyParent) onFileCropped(null); // Notify parent that selection is cleared
    fileUploadComponentRef.current?.reset(); // Reset the underlying file input
    
    
  };

  // Handle modal closing explicitly (e.g., clicking outside or close button)
  const handleCroppingModalOpenChange = (open: boolean) => {
    // Only perform actions when the modal is closing
    if (!open) {
      setIsCroppingModalOpen(false); // Update internal state

      // If the modal is closing BUT applyCrop was NOT clicked during this session,
      // we should revert the state to before the modal was opened for this session.
      // applyCrop sets croppedAreaPixels. If it's still null, it means Cancel or outside click.
      if (croppedAreaPixels === null) {
        // If user cancelled the crop modal...
        // Revert imageSrcForCropper to null and reset cropper state (crop, zoom, etc.)
        // The displayImagePreview should revert to what it was before the modal was opened.
        // If originalFileFromSelection exists and there was no initial image, calling clearSelection handles this.
        if (!displayImagePreview && originalFileFromSelection) {
          // Case: User selected a file, modal opened, then cancelled, AND there was no initial image.
          // We need to clear the selected file and revert everything to empty state.
          clearSelection(true);
        } else {
          // Case: User clicked 'Rogner/Modifier' on an existing image, then cancelled.
          // Or selected a file when there WAS an existing image, then cancelled crop.
          // The displayImagePreview already holds the correct previous image (initialUrl or previous crop blob).
          // We just need to clear the temporary cropper source and state.
          setImageSrcForCropper(null); // Clear the cropper source
          // If imageSrcForCropper was a blob (e.g., from re-cropping displayImagePreview blob),
          // we need to revoke it. The displayBlobUrlRef still holds the URL, so revoking imageSrcForCropper here is safe.
          // Note: The logic in handleReCropOrEdit sets imageSrcForCropper = displayImagePreview.
          // Revoking imageSrcForCropper here *will* revoke the displayImagePreview blob URL.
          // This means cancelling re-cropping on a blob preview makes the preview disappear.
          // This might be acceptable - cancelling means you don't want that intermediate crop.
          // If displayImagePreview was a server URL, imageSrcForCropper was also that URL, no revoke needed.
          if (imageSrcForCropper && imageSrcForCropper.startsWith("blob:")) {
            // Revoke the blob used as the source for the cropper (which was the display preview blob)
            URL.revokeObjectURL(imageSrcForCropper);
            // After revoking, set the display preview back to the initial URL or null
            // and clear the display blob ref. This ensures the UI updates.
            setDisplayImagePreview(initialImagePreviewUrl);
            displayBlobUrlRef.current = null;
          }
          // In summary: cancelling the crop modal after clicking 'Rogner/Modifier'
          // will revert to the initial image (if any) and clear the intermediate blob preview.
        }
      } else {
        // Modal is opening - state should have been prepared by the trigger action
      }
      // Always reset these states on close, regardless of apply/cancel
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null); // Reset this flag for the next session
    } else {
      // Modal is opening
      setIsCroppingModalOpen(true); // Update internal state
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {displayImagePreview ? (
        <div className="flex flex-col items-center space-y-3">
          {/* ADD key prop here */}
          <Image
            width={500}
            height={500}
            key={displayImagePreview} // Add key to force re-render on URL change
            src={displayImagePreview}
            alt="Prévisualisation"
            className={`w-40 h-40 object-cover border-2 border-muted shadow-lg ${
              circularCrop ? "rounded-full" : "rounded-md"
            }`}
          />
          <div className="flex space-x-2">
            <Button
              className="cursor-pointer"
              onClick={handleReCropOrEdit}
              variant="outline"
              size="sm"
            >
              <ImageUp className="mr-2 size-4" /> Rogner
            </Button>
            <Button
              onClick={() => clearSelection(true, true)}
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive cursor-pointer"
            >
              <RotateCcw className="mr-2 size-4" /> Changer
            </Button>
          </div>
        </div>
      ) : (
        <FileUpload
          ref={fileUploadComponentRef}
          onChange={handleFileSelectedByFileUpload}
          accept={accept}
          multiple={false}
          className="w-full max-w-lg"
        />
      )}

      {isCroppingModalOpen && imageSrcForCropper && (
        <CropDialog
          open={isCroppingModalOpen}
          onOpenChange={handleCroppingModalOpenChange}
        >
          <CropDialogContent className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[600px] h-[75vh] flex flex-col p-0">
            <CropDialogHeader className="p-4 border-b">
              <CropDialogTitle>Rogner votre image</CropDialogTitle>
            </CropDialogHeader>
            <div className="relative flex-grow bg-black/80">
              <Cropper
                image={imageSrcForCropper}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={true}
                cropShape={circularCrop ? "round" : "rect"}
                style={{
                  containerStyle: { backgroundColor: "rgba(0,0,0,0.8)" },
                }}
              />
            </div>
            <div className="p-4 space-y-3 border-t bg-background">
              <div className="flex items-center space-x-2">
                <ZoomOut className="h-5 w-5 text-muted-foreground" />
                <input
                  id="zoom-slider"
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.01}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
                  aria-label="Zoom"
                />
                <ZoomIn className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <CropDialogFooter className="p-4 border-t gap-2">
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => handleCroppingModalOpenChange(false)}
              >
                Annuler
              </Button>
              <Button className="cursor-pointer text-white" onClick={applyCrop}>
                Appliquer
              </Button>
            </CropDialogFooter>
          </CropDialogContent>
        </CropDialog>
      )}
    </div>
  );
}
