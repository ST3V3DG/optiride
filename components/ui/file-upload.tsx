// components/ui/file-upload.tsx
"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState, useImperativeHandle, forwardRef, useCallback } from "react"; // useEffect retiré car non utilisé
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone, FileWithPath, Accept } from "react-dropzone";
import { toast } from "sonner"; // Importation de toast

// 1. Définir les valeurs des états d'animation
const mainVariantInitial = { x: 0, y: 0 };
const mainVariantAnimate = { x: 20, y: -20, opacity: 0.9 };
const secondaryVariantInitial = { opacity: 0 };
const secondaryVariantAnimate = { opacity: 1 };

// 2. Initialiser mainVariant et secondaryVariant directement
const mainVariant = {
  initial: mainVariantInitial,
  animate: mainVariantAnimate,
};

const secondaryVariant = {
  initial: secondaryVariantInitial,
  animate: secondaryVariantAnimate,
};

// Assurez-vous que GridPattern est défini correctement. Voici un exemple basé sur le code précédent.
export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}

export interface FileUploadProps {
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export interface FileUploadRef {
  reset: () => void;
}

export const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(
  ({ onChange, accept, multiple = false, className }, ref) => {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(
      (newFiles: File[]) => {
        let filesToSet: File[];
        if (multiple) {
          // Si multiple est vrai, on pourrait vouloir concaténer, mais pour l'upload d'avatar c'est généralement un seul fichier.
          // Si on veut strictement remplacer même en mode multiple (comportement de onDrop):
          filesToSet = newFiles; 
          // Si on veut accumuler en mode multiple (ce que suggère [...files, ...newFiles]):
          // filesToSet = [...files, ...newFiles];
        } else {
          filesToSet = newFiles.length > 0 ? [newFiles[0]] : [];
        }
        setFiles(filesToSet);
        if (onChange) {
          onChange(filesToSet);
        }
      },
      [multiple, onChange /* files retiré des dépendances si on ne veut pas accumuler basé sur l'état précédent `files` */]
    );

    useImperativeHandle(ref, () => ({
      reset: () => {
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    }));

    // const handleClick = () => {
    //   // event.stopPropagation(); // Essayez avec et sans, pour voir si ça change qqc
    //   // event.preventDefault(); // Généralement pas nécessaire ici, mais pour tester
    //   console.log("Div cliquée, tentative d'ouverture de l'input");
    //   if (fileInputRef.current) {
    //     fileInputRef.current.click();
    //     console.log("Clic sur l'input programmé");
    //   } else {
    //     console.log("Référence à l'input non trouvée");
    //   }
    // };

    const dropzoneAccept: Accept | undefined = accept
    ? accept.split(',').reduce((acc, type) => {
        const trimmedType = type.trim();
        if (trimmedType) {
          acc[trimmedType] = [];
        }
        return acc;
      }, {} as Accept)
    : undefined;


    const onDrop = useCallback(
      (acceptedFiles: FileWithPath[]) => {
        handleFileChange(acceptedFiles);
      },
      [handleFileChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: dropzoneAccept,
      multiple: multiple,
      onDrop,
      onDropRejected: (rejectedFiles) => {
        console.log("Fichiers rejetés:", rejectedFiles);
        if (rejectedFiles.length > 0 && rejectedFiles[0].errors.length > 0) {
          const mainError = rejectedFiles[0].errors[0];
          let message = "Fichier non accepté.";
          if (mainError.code === "file-invalid-type")
            message = "Type de fichier invalide.";
          else if (mainError.code === "file-too-large")
            message = "Fichier trop volumineux.";
          else if (mainError.code === "file-too-small")
            message = "Fichier trop petit.";
          toast.error("Erreur d'upload", { description: message });
        } else {
          toast.error("Erreur d'upload", {
            description: "Un ou plusieurs fichiers ont été rejetés.",
          });
        }
      },
    });

    const displayedFile = !multiple && files.length > 0 ? files[0] : null;

    return (
      <div className={cn("w-full", className)} {...getRootProps()}>
        <motion.div
          // onClick={handleClick}
          whileHover="animate" // Pour motion/react (Motion One), c'est plutôt la prop `hover`
          variants={mainVariant}
          initial="initial"
          className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden bg-background"
        >
          {/* Appliquez getInputProps() à l'input */}
          <input {...getInputProps()} /> {/* L'input réel est géré par react-dropzone */}
          {/* L'ancien input peut être retiré si getInputProps() est utilisé */}
          {/*
            <input
              ref={fileInputRef}
              id="file-upload-handle"
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
              className="hidden"
            />
          */}
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
            <GridPattern />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
              Téléverser une image
            </p>
            <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-sm mt-2">
              Glissez-déposez ou cliquez pour sélectionner
            </p>
            <div className="relative w-full mt-8 max-w-md mx-auto">
              {multiple && files.length > 0 && files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  // layoutId et autres props d'animation de Framer Motion peuvent ne pas fonctionner pareil avec motion/react
                  className="relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md shadow-sm"
                >
                  {/* Contenu pour fichier multiple */}
                  <div className="flex justify-between w-full items-center gap-4">
                    <p className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {displayedFile && (
                <motion.div
                  key={"file-single"}
                  layoutId="file-upload-single-item" // Attention: layoutId est une feature de Framer Motion
                  className="relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start min-h-[6rem] p-4 mt-4 w-full mx-auto rounded-md shadow-sm"
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p layout className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
                      {displayedFile.name}
                    </motion.p>
                    <motion.p layout className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input">
                      {(displayedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>
                  <div className="flex text-xs md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                    <motion.p layout className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 ">
                      {displayedFile.type}
                    </motion.p>
                    <motion.p layout>
                      Modifié le {new Date(displayedFile.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              )}

              {files.length === 0 && (
                <>
                  <motion.div
                    layoutId="file-upload-placeholder" // Attention: layoutId
                    variants={mainVariant}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-24 md:h-32 mt-4 w-full max-w-[6rem] md:max-w-[8rem] mx-auto rounded-md shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                  >
                    {isDragActive ? (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neutral-600 dark:text-neutral-300 flex flex-col items-center text-xs">
                        Déposer ici
                        <IconUpload className="h-5 w-5 mt-1 text-neutral-600 dark:text-neutral-400" />
                      </motion.p>
                    ) : (
                      <IconUpload className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                    )}
                  </motion.div>
                  <motion.div
                    variants={secondaryVariant}
                    className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-24 md:h-32 mt-4 w-full max-w-[6rem] md:max-w-[8rem] mx-auto rounded-md"
                  ></motion.div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";