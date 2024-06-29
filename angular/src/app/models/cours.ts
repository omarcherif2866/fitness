export enum JourSemaine {
  LUNDI = 'LUNDI',
  MARDI = 'MARDI',
  MERCREDI = 'MERCREDI',
  JEUDI = 'JEUDI',
  VENDREDI = 'VENDREDI',
  SAMEDI = 'SAMEDI',
  DIMANCHE = 'DIMANCHE'
}

export interface Cours {
  id: number;
  nom: string;
  image: string;
  users: any[];
  dates: JourSemaine[];
  heures: string[];
}
