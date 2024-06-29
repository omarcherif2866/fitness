import { Coach } from "./coach";
import { Cours } from "./cours";
import { Terrain } from "./terrain";
import { User } from "./user.models";


export enum Status {
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  EN_ATTENTE = 'EN_ATTENTE'

}

export interface Reservation {
    id: number;
    date?: string;
    heure?:string;
    status:Status;
    user: User;
    cours?: Cours;
    terrain?: Terrain;
    coach?: Coach;
  }
  