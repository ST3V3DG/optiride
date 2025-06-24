"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Edit, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import NoData from "./no-data";
import DangerZone from "./danger-zone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// Importer le nouveau composant de rognage
import { ImageUploadWithCrop } from "@/components/image-upload-with-crop";
import { useState, useEffect } from "react";
// import { uploadProfilePicture } from "@/server/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";

export default function ProfileCard({ id }: { id: string; }) {
  
  const query = useQuery({
    queryKey: [ 'user' ],
    queryFn: () => apiClient.get(`/users/${id}`),
  });

  const user = query.data?.data.data;

  const [croppedFileToUpload, setCroppedFileToUpload] = useState<File | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(user?.image ?? null);

  useEffect(() => {
    setAvatarImageUrl(user?.image ?? null);
  }, [user?.image]);

  if (!user) {
    return <NoData />;
  }

  const handleFileReadyForUpload = (file: File | null) => {
    setCroppedFileToUpload(file);
  };

  const handleSubmitProfilePicture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!croppedFileToUpload) {
      toast.info("Aucune nouvelle image", {
        description: "Veuillez sélectionner et rogner une image avant de sauvegarder."
      });
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", croppedFileToUpload);

    const toastId = toast.loading("Mise à jour de l'image...", { description: "Veuillez patienter." });

    try {
      // const response = await uploadProfilePicture(formData, String(user.id));
      // if (response.success && response.fileUrl) {
      //   toast.success("Image de profil mise à jour!", {
      //     id: toastId,
      //     description: "Votre nouvelle image est visible."
      //   });
      //   setAvatarImageUrl(response.fileUrl); // Mettre à jour l'avatar
      //   setIsUploadModalOpen(false);
      //   setCroppedFileToUpload(null); // Réinitialiser après succès
      // } else {
      //   toast.error("Échec de la mise à jour", {
      //     id: toastId,
      //     description: response.error || "Un problème est survenu."
      //   });
      // }
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      toast.error("Erreur serveur", {
        id: toastId,
        description: "Une erreur inattendue est survenue."
      });
    }
  };
  
  // Gérer la fermeture de la modale et réinitialiser si nécessaire
  const handleModalOpenChange = (open: boolean) => {
    setIsUploadModalOpen(open);
    if (!open) {
      // Si on ferme la modale sans soumettre, on réinitialise le fichier en attente
      // pour éviter de soumettre une ancienne sélection par erreur plus tard.
      setCroppedFileToUpload(null);
    }
  }


  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-md md:min-h-min p-2 flex flex-col place-content-between gap-4">
      <div className="grid grid-cols-1 gap-4 h-full md:grid-cols-3">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Informations utilisateur</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="grid grid-cols-1 gap-x-8 gap-y-16 pt-6 md:grid-cols-3">
            <div className="flex relative justify-center md:justify-start">
              <div className="relative w-48 h-48 rounded-full border-2 border-muted-foreground/30">
                <Avatar className="rounded-full size-full">
                  <AvatarImage
                    src={avatarImageUrl ?? ""}
                    alt={user?.name ?? "Avatar"}
                    className="object-cover"
                    key={avatarImageUrl}
                  />
                  <AvatarFallback className="text-3xl uppercase rounded-full">
                    {user?.name?.slice(0, 2) ?? "US"}
                  </AvatarFallback>
                </Avatar>
                {/* Utiliser handleModalOpenChange pour la modale principale */}
                <Dialog open={isUploadModalOpen} onOpenChange={handleModalOpenChange}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute right-2 bottom-2 w-10 h-10 rounded-full shadow-md cursor-pointer bg-background hover:bg-muted"
                      aria-label="Changer l'image de profil"
                    >
                      <Edit className="size-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Mettre à jour l&apos;image de profil</DialogTitle>
                      <DialogDescription>
                        Sélectionnez, rognez, puis sauvegardez votre nouvelle image.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitProfilePicture} className="mt-4 space-y-6">
                       <ImageUploadWithCrop
                          onFileCropped={handleFileReadyForUpload}
                          aspectRatio={1} // Carré
                          initialImagePreviewUrl={avatarImageUrl} // URL de l'image actuelle pour prévisualisation/re-rognage
                          accept="image/jpeg, image/png, image/webp, image/gif"
                          circularCrop={true} // Pour un avatar rond
                       />
                      <div className="flex justify-end pt-2 space-x-2">
                        <Button type="button" variant="outline" onClick={() => handleModalOpenChange(false)}>
                          Annuler
                        </Button>
                        <Button type="submit" className="text-white" disabled={!croppedFileToUpload}>
                          Sauvegarder
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
             <div className="col-span-1 md:col-span-2">
              <ul className="space-y-3">
                 <li>
                  <span className="mr-2 font-medium">NIC/Passport :</span>
                  <span>{user.nic_passport_number ?? "N/A"}</span>
                </li>
                <li>
                  <span className="mr-2 font-medium">Nom :</span>
                  <span className="capitalize">{user.name ?? "N/A"}</span>
                </li>
                {/* ... autres champs ... */}
                <li>
                  <span className="mr-2 font-medium">Date d&apos;inscription :</span>
                  <span className="capitalize">{user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric'}) : "N/A"}</span>
                </li>
                 <li className="pt-2">
                  <Link
                    href={`/dashboard/users/${user.id}/cars`}
                    className="flex items-center text-sm text-primary hover:underline"
                  >
                    <span>Voir les véhicules</span>
                    <ExternalLink className="ml-1 size-4" />
                  </Link>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
         <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Photos d&apos;identité</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex justify-center items-center text-sm rounded-lg border border-accent-foreground/50 aspect-video bg-muted text-muted-foreground">
              {user.nic_passport_recto ? <Image width={500} height={500} src={user.nic_passport_recto as string} alt="ID Recto" className="object-contain w-full h-full"/> : "Recto ID (non fourni)"}
            </div>
            <div className="flex justify-center items-center text-sm rounded-lg border border-accent-foreground/50 aspect-video bg-muted text-muted-foreground">
            {user.nic_passport_verso ? <Image width={500} height={500} src={user.nic_passport_verso as string} alt="ID Verso" className="object-contain w-full h-full"/> : "Verso ID (non fourni)"}
            </div>
          </CardContent>
        </Card>
      </div>
      <DangerZone id={user.id} collectionName="users" />
    </div>
  );
}