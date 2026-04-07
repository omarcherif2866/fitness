// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Cours } from '../models/cours';
// import { Observable, catchError } from 'rxjs';
// import { JourSemaine } from '../models/coach';

// @Injectable({
//   providedIn: 'root'
// })
// export class CoursService {
//   private apiUrl="https://stellar-integrity-production.up.railway.app/cours";

//   constructor(private httpClient: HttpClient) { }

//   addCours(coursData: any): Observable<Cours> {
//     return this.httpClient.post<Cours>(this.apiUrl, coursData)
//       .pipe(
//         catchError(this.handleError) // Gestion des erreurs
//       );
//   }

//   private handleError(error: any): Observable<never> {
//     console.error('Erreur:', error);
//     throw error;
//   }

//   getAllCours(): Observable<Cours[]> {
//     return this.httpClient.get<Cours[]>(this.apiUrl + '/allCours');
//   }

//   deleteCours(id: number) {
//     return this.httpClient.delete<Cours>(this.apiUrl + '/' + id);
//   }
  
//   updateCours(id: number, data: Cours): Observable<Cours> {
//     return this.httpClient.put<Cours>(this.apiUrl + '/' + id, data);
//   }

//   getCoursByDay(day: JourSemaine): Observable<Cours[]> {
//     return this.httpClient.get<Cours[]>(`${this.apiUrl}/bydates/${day}`);
//   }

// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cours } from '../models/cours';
import { JourSemaine } from '../models/coach';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private jsonUrl = 'assets/json/cours.json';
  private localStorageKey = 'localCours';

  constructor(private httpClient: HttpClient) {}

  // ✅ Récupérer tous les cours (JSON + localStorage)
  getAllCours(): Observable<Cours[]> {
    return this.httpClient.get<any>(this.jsonUrl).pipe(
      map(data => {
        const jsonCours: Cours[] = data.cours;

        // Fusionner avec les cours ajoutés localement
        const localCours: Cours[] = JSON.parse(
          localStorage.getItem(this.localStorageKey) || '[]'
        );

        // Filtrer les supprimés
        const deletedIds: number[] = JSON.parse(
          localStorage.getItem('deletedCoursIds') || '[]'
        );

        const allCours = [...jsonCours, ...localCours].filter(
          c => !deletedIds.includes(c.id)
        );

        // Appliquer les modifications locales
        return allCours.map(c => this.getUpdatedCours(c));
      }),
      catchError(this.handleError)
    );
  }

  // ✅ Ajouter un cours (sauvegardé dans localStorage)
  addCours(coursData: any): Observable<Cours> {
    const newCours: Cours = {
      ...coursData,
      id: Date.now(),
      users: coursData.users || []
    };

    const localCours: Cours[] = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    localCours.push(newCours);
    localStorage.setItem(this.localStorageKey, JSON.stringify(localCours));

    return of(newCours);
  }

  // ✅ Supprimer un cours
  deleteCours(id: number): Observable<Cours> {
    // Supprimer des cours locaux si présent
    const localCours: Cours[] = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    const filtered = localCours.filter(c => c.id !== id);
    localStorage.setItem(this.localStorageKey, JSON.stringify(filtered));

    // Marquer comme supprimé (pour les cours du JSON)
    const deletedIds: number[] = JSON.parse(
      localStorage.getItem('deletedCoursIds') || '[]'
    );
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('deletedCoursIds', JSON.stringify(deletedIds));
    }

    return of({} as Cours);
  }

  // ✅ Modifier un cours
  updateCours(id: number, data: Cours): Observable<Cours> {
    const updatedCours = { ...data, id };

    const updates: { [key: number]: Cours } = JSON.parse(
      localStorage.getItem('updatedCours') || '{}'
    );
    updates[id] = updatedCours;
    localStorage.setItem('updatedCours', JSON.stringify(updates));

    // Mettre à jour aussi dans localCours si c'est un cours ajouté localement
    const localCours: Cours[] = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    const index = localCours.findIndex(c => c.id === id);
    if (index !== -1) {
      localCours[index] = updatedCours;
      localStorage.setItem(this.localStorageKey, JSON.stringify(localCours));
    }

    return of(updatedCours);
  }

  // ✅ Filtrer par jour de la semaine
  getCoursByDay(day: JourSemaine): Observable<Cours[]> {
    return this.getAllCours().pipe(
      map(cours => cours.filter(c => c.dates.includes(day)))
    );
  }

  // ─── Helpers privés ───────────────────────────────────────

  private getUpdatedCours(cours: Cours): Cours {
    const updates: { [key: number]: Cours } = JSON.parse(
      localStorage.getItem('updatedCours') || '{}'
    );
    return updates[cours.id] ? updates[cours.id] : cours;
  }

  private handleError(error: any): Observable<never> {
    console.error('Erreur:', error);
    return throwError(() => error);
  }
}