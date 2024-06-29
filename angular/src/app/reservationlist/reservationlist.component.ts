import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservationlist.component.html',
  styleUrls: ['./reservationlist.component.css']
})
export class ReservationListComponent {
  constructor(private http: HttpClient) {}

  // Méthode pour supprimer une réservation
  deleteReservation(reservationId: string): Observable<any> {
    return this.http.delete<any>(`/api/reservations/${reservationId}`);
  }
}
