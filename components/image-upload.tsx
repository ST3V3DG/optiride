// components/ui/image-upload.tsx (ou le chemin que vous utilisez)
"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { FileUpload } from "@/components/ui/file-upload"; // Votre composant existant
import {
  Dialog as CropDialog,
  DialogContent as CropDialogContent,
  DialogHeader as CropDialogHeader,
  DialogTitle as CropDialogTitle,
  DialogFooter as CropDialogFooter,
} from '@/components/ui/dialog'; // Composants Radix UI
import { Button } from '@/components/ui/button';
import getCroppedImg, { urlToFile } from '@/lib/crop-image'; // L'utilitaire créé
import { RotateCcw } from 'lucide-react'; // Pour un bouton Réinitialiser/Changer
import { toast } from 'sonner';
<<<<<<< HEAD
import Image from "next/image";
=======
import Image from 'next/image';
>>>>>>> fix-build-errors

interface ImageUploadProps {
  accept?: string;
  onFileCropped: (file: File | null) => void;
  aspectRatio?: number;
  initialImagePreviewUrl?: string | null;
}

export function ImageUpload({
  accept = "image/*",
  onFileCropped,
  aspectRatio = 1, // Carré par défaut
  initialImagePreviewUrl = null,
}: ImageUploadProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [imageSrcToCrop, setImageSrcToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [displayImagePreview, setDisplayImagePreview] = useState<string | null>(null);
  const [isCroppingModalOpen, setIsCroppingModalOpen] = useState(false);

  // Permet de réinitialiser le FileUpload si on change d'image
  const fileUploadRef = useRef<{ reset: () => void }>(null);

  const clearSelection = useCallback((notifyParent = true) => {
    // Révoquer l'URL de l'objet blob si displayImagePreview est un blob
    if (displayImagePreview && displayImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(displayImagePreview);
    }
    if (imageSrcToCrop && imageSrcToCrop.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrcToCrop);
    }

    setOriginalFile(null);
    setImageSrcToCrop(null);
    setDisplayImagePreview(initialImagePreviewUrl); // Revenir à l'URL initiale ou null
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsCroppingModalOpen(false);
    if (notifyParent) {
      onFileCropped(null);
    }
    fileUploadRef.current?.reset(); // Réinitialiser le FileUpload pour permettre nouvelle sélection
  }, [
    displayImagePreview,
    imageSrcToCrop,
    initialImagePreviewUrl,
    onFileCropped,
    fileUploadRef
  ]);

  // Gérer l'affichage initial et les changements d'initialImagePreviewUrl
  useEffect(() => {
    if (initialImagePreviewUrl) {
      setDisplayImagePreview(initialImagePreviewUrl);
      // Si on veut permettre de rogner l'image initiale sans re-sélectionner:
      setImageSrcToCrop(initialImagePreviewUrl);
    } else {
      setDisplayImagePreview(null); // S'assurer de nettoyer si l'URL initiale est retirée
    }
  }, [initialImagePreviewUrl]);
  
  const clearSelection = useCallback((notifyParent = true) => {
    // Révoquer l'URL de l'objet blob si displayImagePreview est un blob
    if (displayImagePreview && displayImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(displayImagePreview);
    }
    if (imageSrcToCrop && imageSrcToCrop.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrcToCrop);
    }

    setOriginalFile(null);
    setImageSrcToCrop(null);
    setDisplayImagePreview(initialImagePreviewUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setIsCroppingModalOpen(false);
    if (notifyParent) {
      onFileCropped(null);
    }
    fileUploadRef.current?.reset();
  }, [
    displayImagePreview,
    imageSrcToCrop,
    initialImagePreviewUrl,
    onFileCropped,
   fileUploadRef
 ]);


  const handleFileSelect = useCallback((selectedFiles: File[]) => {
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Type de fichier non supporté', { description: "Veuillez sélectionner une image."});
        clearSelection(false); // Ne pas notifier le parent si c'était juste une mauvaise sélection
        return;
      }
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onloadend = () => { // Utiliser onloadend pour être sûr que tout est lu
        const result = reader.result as string;
        setImageSrcToCrop(result);
        // setDisplayImagePreview(result); // Optionnel: afficher l'original avant rognage
        setIsCroppingModalOpen(true);
        setCrop({ x: 0, y: 0 }); // Réinitialiser le crop/zoom pour la nouvelle image
        setZoom(1);
      };
      reader.readAsDataURL(file);
    }
  }, [clearSelection]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixelsValue: Area) => {
    setCroppedAreaPixels(croppedAreaPixelsValue);
  }, []);

  const applyCrop = async () => {
    if (!imageSrcToCrop || !croppedAreaPixels || (!originalFile && !initialImagePreviewUrl)) {
        toast.error("Erreur de rognage", { description: "Données de rognage manquantes."});
        return;
    }
    
    // Déterminer le nom et le type du fichier source (soit originalFile, soit déduit de initialImagePreviewUrl)
    const sourceFileName = originalFile ? originalFile.name : (initialImagePreviewUrl?.substring(initialImagePreviewUrl.lastIndexOf('/') + 1) || 'cropped-image.png');
    const sourceMimeType = originalFile ? originalFile.type : 'image/png'; // Ou essayez de deviner à partir de l'extension de initialImagePreviewUrl

    try {
      const croppedImageUrl = await getCroppedImg(imageSrcToCrop, croppedAreaPixels);
      if (croppedImageUrl) {
        setDisplayImagePreview(croppedImageUrl);
        const croppedFile = await urlToFile(
          croppedImageUrl,
          `cropped-${sourceFileName}`,
          sourceMimeType
        );
        onFileCropped(croppedFile);
        setIsCroppingModalOpen(false);
      }
    } catch (e) {
      console.error('Erreur lors du rognage:', e);
      toast.error("Erreur de rognage", { description: "Impossible de générer l'image rognée."});
      onFileCropped(null);
    }
  };

  const handleOpenCropperWithCurrentImage = () => {
    // Si on a déjà une image affichée (initiale ou déjà rognée) et qu'on veut la (re-)rogner
    if (displayImagePreview) {
        // Si l'image affichée vient d'un fichier original, on utilise ce fichier pour le cropper
        if (originalFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrcToCrop(reader.result as string);
                setIsCroppingModalOpen(true);
            };
            reader.readAsDataURL(originalFile);
        } else if (initialImagePreviewUrl) { 
            // Si c'est une image initiale (URL), on l'utilise directement
            // Assurez-vous que le serveur d'où vient `initialImagePreviewUrl` autorise CORS pour `createImage`
            setImageSrcToCrop(initialImagePreviewUrl);
            setIsCroppingModalOpen(true);
        }
         // Réinitialiser crop/zoom pour une nouvelle session de rognage
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    } else {
        // Si pas d'image, on ne peut pas ouvrir le cropper. L'utilisateur doit d'abord sélectionner un fichier.
        // On pourrait déclencher un clic sur FileUpload ici si c'est possible.
        toast.info("Aucune image", { description: "Veuillez d'abord sélectionner une image."});
    }
  };

  // Nettoyage des URLs blob à la destruction du composant
  useEffect(() => {
    const currentDisplayImage = displayImagePreview;
    const currentImageSrcToCrop = imageSrcToCrop;
    return () => {
      if (currentDisplayImage && currentDisplayImage.startsWith('blob:') && currentDisplayImage !== initialImagePreviewUrl) {
        URL.revokeObjectURL(currentDisplayImage);
      }
      if (currentImageSrcToCrop && currentImageSrcToCrop.startsWith('blob:') && currentImageSrcToCrop !== initialImagePreviewUrl) {
        URL.revokeObjectURL(currentImageSrcToCrop);
      }
    };
  }, [displayImagePreview, imageSrcToCrop, initialImagePreviewUrl]);


  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {displayImagePreview ? (
        <div className="flex flex-col items-center space-y-3">
          <Image
<<<<<<< HEAD
            height={500}
            width={500}
=======
          width={500}
          height={500}
>>>>>>> fix-build-errors
            src={displayImagePreview}
            alt="Prévisualisation"
            className="w-48 h-48 object-cover border rounded-full" // Style pour photo de profil
          />
          <div className="flex space-x-2">
            <Button onClick={handleOpenCropperWithCurrentImage} variant="outline" size="sm">
              Rogner / Modifier
            </Button>
            <Button onClick={() => clearSelection(true)} variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <RotateCcw className="mr-2 h-4 w-4" /> Changer
            </Button>
          </div>
        </div>
      ) : (
        // FileUpload s'affiche seulement s'il n'y a pas de preview
        // Assurez-vous que FileUpload a un ref="fileUploadRef" et une méthode reset si nécessaire.
        // Ou, si FileUpload est un input simple, il se réinitialisera par défaut.
        <FileUpload
          ref={fileUploadRef} // Nécessite que FileUpload forward le ref et expose une méthode reset
          onChange={handleFileSelect}
          accept={accept}
          multiple={false} // Forcer false car on gère un seul fichier pour le rognage
          className="w-full min-h-48" // Style pour la zone de drop
        />
      )}

      {isCroppingModalOpen && imageSrcToCrop && (
        <CropDialog open={isCroppingModalOpen} onOpenChange={(open) => {
            if (!open) { // Si la modale se ferme (ex: clic extérieur, Echap)
                setIsCroppingModalOpen(false);
                // Optionnel : si l'image source pour le crop n'est pas l'image actuellement affichée
                // (ex: on a annulé le crop d'une nouvelle image mais on veut garder l'ancienne preview)
                // on ne fait rien sur displayImagePreview.
                // Si on n'a pas d'image affichée et qu'on annule la sélection d'un nouveau fichier, on clear tout.
                if (!displayImagePreview && !originalFile) {
                  clearSelection(true);
                } else if (imageSrcToCrop && imageSrcToCrop.startsWith('blob:') && imageSrcToCrop !== displayImagePreview) {
                  // Nettoyer le blob de l'image qui était dans le cropper si ce n'est pas celle affichée
                  URL.revokeObjectURL(imageSrcToCrop);
                  setImageSrcToCrop(null); // Ne plus garder en mémoire pour le cropper
                }
            } else {
                setIsCroppingModalOpen(true);
            }
        }}>
          <CropDialogContent className="sm:max-w-[90vw] md:max-w-[60vw] lg:max-w-[500px] h-[70vh] flex flex-col p-0">
            <CropDialogHeader className="p-4 border-b">
              <CropDialogTitle>Rogner votre image</CropDialogTitle>
            </CropDialogHeader>
            <div className="relative flex-grow">
              <Cropper
                image={imageSrcToCrop}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={true}
              />
            </div>
            <div className="p-4 space-y-2 border-t">
                <label htmlFor="zoom" className="text-sm font-medium">Zoom</label>
                <input
                    id="zoom"
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.01}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
            </div>
            <CropDialogFooter className="p-4 border-t">
              <Button variant="outline" onClick={() => setIsCroppingModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={applyCrop}>Appliquer et Sauvegarder</Button>
            </CropDialogFooter>
          </CropDialogContent>
        </CropDialog>
      )}
    </div>
  );
}