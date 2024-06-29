import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation, Status } from '../models/reservation';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl="http://localhost:8090/reservation";

  constructor(private httpClient: HttpClient) { }

  getAllReservation(): Observable<Reservation[]> {
    return this.httpClient.get<Reservation[]>(this.apiUrl);
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.httpClient.post<Reservation>(this.apiUrl, reservation);
  }

  deleteReservation(id: number) {
    return this.httpClient.delete<Reservation>(this.apiUrl + '/' + id);
  }
  getReservationById(id: any): Observable<Reservation> {
    return this.httpClient.get<Reservation>(this.apiUrl+ '/' + id);
  }

  updateReservation(id: number, data: Reservation): Observable<Reservation> {
    return this.httpClient.put<Reservation>(this.apiUrl + '/' + id, data)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Erreur lors de la mise à jour de la réservation:', error);
                throw error; // Ré-émettre l'erreur pour la gestion ultérieure
            })
        );
}


  updateReservationStatus(id: number, status: Status): Observable<Reservation> {
    return this.httpClient.put<Reservation>(`${this.apiUrl}/status/${id}`, {}, {
      params: new HttpParams().set('status', status)
    });
  }

  getReservationsByUserId(userId: number): Observable<Reservation[]> {
    return this.httpClient.get<Reservation[]>(`${this.apiUrl}/user/${userId}`);
  }
}
