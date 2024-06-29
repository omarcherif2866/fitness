import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cours } from '../models/cours';
import { Observable, catchError } from 'rxjs';
import { JourSemaine } from '../models/coach';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private apiUrl="http://localhost:8090/cours";

  constructor(private httpClient: HttpClient) { }

  addCours(coursData: any): Observable<Cours> {
    return this.httpClient.post<Cours>(this.apiUrl, coursData)
      .pipe(
        catchError(this.handleError) // Gestion des erreurs
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Erreur:', error);
    throw error;
  }

  getAllCours(): Observable<Cours[]> {
    return this.httpClient.get<Cours[]>(this.apiUrl + '/allCours');
  }

  deleteCours(id: number) {
    return this.httpClient.delete<Cours>(this.apiUrl + '/' + id);
  }
  
  updateCours(id: number, data: Cours): Observable<Cours> {
    return this.httpClient.put<Cours>(this.apiUrl + '/' + id, data);
  }

  getCoursByDay(day: JourSemaine): Observable<Cours[]> {
    return this.httpClient.get<Cours[]>(`${this.apiUrl}/bydates/${day}`);
  }

}
