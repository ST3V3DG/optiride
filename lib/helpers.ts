/**
 * Convertit un nombre de minutes en format heures:minutes (HH:mm)
 * @param minutes - Le nombre de minutes à convertir
 * @returns Une chaîne au format "HH:mm"
 * @example
 * convertMinutesToHours(90) // retourne "01:30"
 * convertMinutesToHours(145) // retourne "02:25"
 */
export function convertMinutesToHours(minutes: number): string {
  if (minutes < 0) return "00:00";
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = remainingMinutes.toString().padStart(2, "0");
  
  return `${formattedHours}:${formattedMinutes}`;
}

export function convertirHeureEnDate(heure: string): Date {
  // Récupérer les heures et minutes de la chaîne
  const [heures, minutes] = heure.split(":").map(Number);

  // Créer un nouvel objet Date avec la date actuelle
  const date = new Date();

  // Définir les heures et minutes
  date.setHours(heures);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export function getCookie(name: string) {
  if (typeof document === 'undefined') {
    return null; // or handle the server-side case appropriately
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') {
    return; // or handle the server-side case appropriately
  }
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
