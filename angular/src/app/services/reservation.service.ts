// import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Reservation, Status } from '../models/reservation';
// import { Observable, catchError } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ReservationService {

//   private apiUrl="https://stellar-integrity-production.up.railway.app/reservation";

//   constructor(private httpClient: HttpClient) { }

//   getAllReservation(): Observable<Reservation[]> {
//     return this.httpClient.get<Reservation[]>(this.apiUrl);
//   }

//   addReservation(reservation: Reservation): Observable<Reservation> {
//     return this.httpClient.post<Reservation>(this.apiUrl, reservation);
//   }

//   deleteReservation(id: number) {
//     return this.httpClient.delete<Reservation>(this.apiUrl + '/' + id);
//   }
//   getReservationById(id: any): Observable<Reservation> {
//     return this.httpClient.get<Reservation>(this.apiUrl+ '/' + id);
//   }

//   updateReservation(id: number, data: Reservation): Observable<Reservation> {
//     return this.httpClient.put<Reservation>(this.apiUrl + '/' + id, data)
//         .pipe(
//             catchError((error: HttpErrorResponse) => {
//                 console.error('Erreur lors de la mise à jour de la réservation:', error);
//                 throw error; // Ré-émettre l'erreur pour la gestion ultérieure
//             })
//         );
// }


//   updateReservationStatus(id: number, status: Status): Observable<Reservation> {
//     return this.httpClient.put<Reservation>(`${this.apiUrl}/status/${id}`, {}, {
//       params: new HttpParams().set('status', status)
//     });
//   }

//   getReservationsByUserId(userId: number): Observable<Reservation[]> {
//     return this.httpClient.get<Reservation[]>(`${this.apiUrl}/user/${userId}`);
//   }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation, Status } from '../models/reservation';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private jsonUrl = 'assets/json/reservation.json';
  private localStorageKey = 'localReservations';

  constructor(private httpClient: HttpClient) {}

  // ✅ Récupérer toutes les réservations (JSON + localStorage)
  getAllReservation(): Observable<Reservation[]> {
    return this.httpClient.get<any>(this.jsonUrl).pipe(
      map(data => {
        const jsonReservations: Reservation[] = data.reservations;

        // Fusionner avec les réservations locales
        const localReservations: Reservation[] = JSON.parse(
          localStorage.getItem(this.localStorageKey) || '[]'
        );

        // Filtrer les supprimées
        const deletedIds: number[] = JSON.parse(
          localStorage.getItem('deletedReservationIds') || '[]'
        );

        const all = [...jsonReservations, ...localReservations].filter(
          r => !deletedIds.includes(r.id)
        );

        // Appliquer les modifications locales
        return all.map(r => this.getUpdatedReservation(r));
      }),
      catchError(this.handleError)
    );
  }

  // ✅ Récupérer une réservation par ID
  getReservationById(id: any): Observable<Reservation> {
    return this.getAllReservation().pipe(
      map(reservations => {
        const found = reservations.find(r => r.id === +id);
        if (!found) throw new Error(`Réservation #${id} introuvable`);
        return found;
      }),
      catchError(this.handleError)
    );
  }

  // ✅ Récupérer les réservations d'un utilisateur
  getReservationsByUserId(userId: number): Observable<Reservation[]> {
    return this.getAllReservation().pipe(
      map(reservations => reservations.filter(r => r.user?.id === userId))
    );
  }

  // ✅ Ajouter une réservation
  addReservation(reservation: Reservation): Observable<Reservation> {
    const newReservation: Reservation = {
      ...reservation,
      id: Date.now(),
      status: reservation.status || Status.EN_ATTENTE
    };

    const localReservations: Reservation[] = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    localReservations.push(newReservation);
    localStorage.setItem(this.localStorageKey, JSON.stringify(localReservations));

    return of(newReservation);
  }

  // ✅ Supprimer une réservation
  deleteReservation(id: number): Observable<Reservation> {
    // Supprimer des locales si présente
    const localReservations: Reservation[] = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    const filtered = localReservations.filter(r => r.id !== id);
    localStorage.setItem(this.localStorageKey, JSON.stringify(filtered));

    // Marquer comme supprimée (pour celles du JSON)
    const deletedIds: number[] = JSON.parse(
      localStorage.getItem('deletedReservationIds') || '[]'
    );
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('deletedReservationIds', JSON.stringify(deletedIds));
    }

    return of({} as Reservation);
  }

  // ✅ Modifier une réservation complète
  updateReservation(id: number, data: Reservation): Observable<Reservation> {
    const updated = { ...data, id };

    const updates: { [key: number]: Reservation } = JSON.parse(
      localStorage.getItem('updatedReservations') || '{}'
    );
    updates[id] = updated;
    localStorage.setItem('updatedReservations', JSON.stringify(updates));

    // Mettre à jour dans localReservations si ajoutée localement
    const localReservations: Reservation[] = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    const index = localReservations.findIndex(r => r.id === id);
    if (index !== -1) {
      localReservations[index] = updated;
      localStorage.setItem(this.localStorageKey, JSON.stringify(localReservations));
    }

    return of(updated);
  }

  // ✅ Modifier uniquement le statut
  updateReservationStatus(id: number, status: Status): Observable<Reservation> {
    return this.getReservationById(id).pipe(
      map(reservation => {
        const updated: Reservation = { ...reservation, status };

        const updates: { [key: number]: Reservation } = JSON.parse(
          localStorage.getItem('updatedReservations') || '{}'
        );
        updates[id] = updated;
        localStorage.setItem('updatedReservations', JSON.stringify(updates));

        // Mettre à jour dans localReservations si présente
        const localReservations: Reservation[] = JSON.parse(
          localStorage.getItem(this.localStorageKey) || '[]'
        );
        const index = localReservations.findIndex(r => r.id === id);
        if (index !== -1) {
          localReservations[index] = updated;
          localStorage.setItem(this.localStorageKey, JSON.stringify(localReservations));
        }

        return updated;
      }),
      catchError(this.handleError)
    );
  }

  // ─── Helpers privés ───────────────────────────────────────

  private getUpdatedReservation(reservation: Reservation): Reservation {
    const updates: { [key: number]: Reservation } = JSON.parse(
      localStorage.getItem('updatedReservations') || '{}'
    );
    return updates[reservation.id] ? updates[reservation.id] : reservation;
  }

  private handleError(error: any): Observable<never> {
    console.error('Erreur ReservationService:', error);
    return throwError(() => error);
  }
}