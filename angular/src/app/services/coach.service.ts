// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Coach, JourSemaine } from '../models/coach';
// import { Observable, catchError } from 'rxjs';
// // import { JourSemaine } from '../models/cours';

// @Injectable({
//   providedIn: 'root'
// })
// export class CoachService {
//   private apiUrl="https://stellar-integrity-production.up.railway.app/coach";

//   constructor(private httpClient: HttpClient) { }

//   addCoach(coachData: any): Observable<Coach> {
//     return this.httpClient.post<Coach>(this.apiUrl, coachData)
//       .pipe(
//         catchError(this.handleError) // Gestion des erreurs
//       );
//   }

//   private handleError(error: any): Observable<never> {
//     console.error('Erreur:', error);
//     throw error;
//   }

//   getAllCoach(): Observable<Coach[]> {
//     return this.httpClient.get<Coach[]>(this.apiUrl + '/allCoach');
//   }

//   deleteCoach(id: number) {
//     return this.httpClient.delete<Coach>(this.apiUrl + '/' + id);
//   }
  
//   updateCoach(id: number, data: Coach): Observable<Coach> {
//     return this.httpClient.put<Coach>(this.apiUrl + '/' + id, data);
//   }

//   getCoachByDay(day: JourSemaine): Observable<Coach[]> {
//     return this.httpClient.get<Coach[]>(`${this.apiUrl}/bydates/${day}`);
//   }
// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coach, JourSemaine } from '../models/coach';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private jsonUrl = 'assets/json/coaches.json';
  private localStorageKey = 'localCoaches';

  constructor(private httpClient: HttpClient) {}

  // ✅ Récupérer tous les coaches (JSON + localStorage)
  getAllCoach(): Observable<Coach[]> {
    return this.httpClient.get<any>(this.jsonUrl).pipe(
      map(data => {
        const jsonCoaches: Coach[] = data.coaches;

        // Fusionner avec les coaches ajoutés localement
        const localCoaches: Coach[] = JSON.parse(
          localStorage.getItem(this.localStorageKey) || '[]'
        );

        // Filtrer les supprimés
        const deletedIds: number[] = JSON.parse(
          localStorage.getItem('deletedCoachIds') || '[]'
        );

        const allCoaches = [...jsonCoaches, ...localCoaches].filter(
          c => !deletedIds.includes(c.id)
        );

        // Appliquer les modifications locales
        return allCoaches.map(c => this.getUpdatedCoach(c));
      }),
      catchError(this.handleError)
    );
  }

  // ✅ Ajouter un coach (sauvegardé dans localStorage)
  addCoach(coachData: any): Observable<Coach> {
    const newCoach: Coach = {
      ...coachData,
      id: Date.now(),
      users: coachData.users || []
    };

    const localCoaches: Coach[] = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    localCoaches.push(newCoach);
    localStorage.setItem(this.localStorageKey, JSON.stringify(localCoaches));

    return of(newCoach);
  }

  // ✅ Supprimer un coach
  deleteCoach(id: number): Observable<Coach> {
    // Supprimer des coaches locaux si présent
    const localCoaches: Coach[] = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    const filtered = localCoaches.filter(c => c.id !== id);
    localStorage.setItem(this.localStorageKey, JSON.stringify(filtered));

    // Marquer comme supprimé (pour les coaches du JSON)
    const deletedIds: number[] = JSON.parse(
      localStorage.getItem('deletedCoachIds') || '[]'
    );
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('deletedCoachIds', JSON.stringify(deletedIds));
    }

    return of({} as Coach);
  }

  // ✅ Modifier un coach
  updateCoach(id: number, data: Coach): Observable<Coach> {
    const updatedCoach = { ...data, id };

    const updates: { [key: number]: Coach } = JSON.parse(
      localStorage.getItem('updatedCoaches') || '{}'
    );
    updates[id] = updatedCoach;
    localStorage.setItem('updatedCoaches', JSON.stringify(updates));

    // Mettre à jour aussi dans localCoaches si c'est un coach ajouté localement
    const localCoaches: Coach[] = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    const index = localCoaches.findIndex(c => c.id === id);
    if (index !== -1) {
      localCoaches[index] = updatedCoach;
      localStorage.setItem(this.localStorageKey, JSON.stringify(localCoaches));
    }

    return of(updatedCoach);
  }

  // ✅ Filtrer par jour de la semaine
  getCoachByDay(day: JourSemaine): Observable<Coach[]> {
    return this.getAllCoach().pipe(
      map(coaches => coaches.filter(c => c.dates.includes(day)))
    );
  }

  // ─── Helpers privés ───────────────────────────────────────

  // Appliquer les modifications locales sur un coach du JSON
  private getUpdatedCoach(coach: Coach): Coach {
    const updates: { [key: number]: Coach } = JSON.parse(
      localStorage.getItem('updatedCoaches') || '{}'
    );
    return updates[coach.id] ? updates[coach.id] : coach;
  }

  private handleError(error: any): Observable<never> {
    console.error('Erreur:', error);
    return throwError(() => error);
  }
}