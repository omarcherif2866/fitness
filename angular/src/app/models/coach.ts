export enum JourSemaine {
  LUNDI = 'LUNDI',
  MARDI = 'MARDI',
  MERCREDI = 'MERCREDI',
  JEUDI = 'JEUDI',
  VENDREDI = 'VENDREDI',
  SAMEDI = 'SAMEDI',
  DIMANCHE = 'DIMANCHE'
}

export interface Coach {
    id: number;
    nom: string;
    image: string;
    prenom: string;
    specialite: string;
    users: any[];
    dates: JourSemaine[];
    heures: string[];
  }
  