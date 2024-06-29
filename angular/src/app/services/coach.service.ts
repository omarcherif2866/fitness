import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coach, JourSemaine } from '../models/coach';
import { Observable, catchError } from 'rxjs';
// import { JourSemaine } from '../models/cours';

@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private apiUrl="http://localhost:8090/coach";

  constructor(private httpClient: HttpClient) { }

  addCoach(coachData: any): Observable<Coach> {
    return this.httpClient.post<Coach>(this.apiUrl, coachData)
      .pipe(
        catchError(this.handleError) // Gestion des erreurs
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Erreur:', error);
    throw error;
  }

  getAllCoach(): Observable<Coach[]> {
    return this.httpClient.get<Coach[]>(this.apiUrl + '/allCoach');
  }

  deleteCoach(id: number) {
    return this.httpClient.delete<Coach>(this.apiUrl + '/' + id);
  }
  
  updateCoach(id: number, data: Coach): Observable<Coach> {
    return this.httpClient.put<Coach>(this.apiUrl + '/' + id, data);
  }

  getCoachByDay(day: JourSemaine): Observable<Coach[]> {
    return this.httpClient.get<Coach[]>(`${this.apiUrl}/bydates/${day}`);
  }
}
