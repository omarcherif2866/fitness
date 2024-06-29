import { Injectable } from '@angular/core';

interface Reservation {
  id: number;
  name: string;
  date: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservations: Reservation[] = [];
  private nextId = 1;

  constructor() { }

  addReservation(name: string, date: string, time: string): void {
    this.reservations.push({ id: this.nextId++, name, date, time });
  }

  getReservations(): Reservation[] {
    return this.reservations;
  }

  deleteReservation(id: number): void {
    this.reservations = this.reservations.filter(reservation => reservation.id !== id);
  }
}
