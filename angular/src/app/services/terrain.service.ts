// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Terrain } from '../models/terrain';
// import { Observable, catchError } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class TerrainService {

//   private apiUrl="https://stellar-integrity-production.up.railway.app/terrain";

//   constructor(private httpClient: HttpClient) { }

//   addTerrain(terrainData: any): Observable<Terrain> {
//     return this.httpClient.post<Terrain>(this.apiUrl, terrainData)
//       .pipe(
//         catchError(this.handleError) // Gestion des erreurs
//       );
//   }

//   private handleError(error: any): Observable<never> {
//     console.error('Erreur:', error);
//     throw error;
//   }

//   getAllTerrain(): Observable<Terrain[]> {
//     return this.httpClient.get<Terrain[]>(this.apiUrl + '/allTerrain');
//   }

//   deleteTerrain(id: number) {
//     return this.httpClient.delete<Terrain>(this.apiUrl + '/' + id);
//   }
  
//   updateTerrain(id: number, data: Terrain): Observable<Terrain> {
//     return this.httpClient.put<Terrain>(this.apiUrl + '/' + id, data);
//   }
// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Terrain } from '../models/terrain';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TerrainService {

  private jsonUrl = 'assets/json/terrain.json';
  private storageKey = 'terrains';

  constructor(private http: HttpClient) {}

  // 🔹 Charger depuis JSON ou localStorage
getAllTerrain(): Observable<Terrain[]> {
  const data = localStorage.getItem(this.storageKey);

  if (data) {
    return of(JSON.parse(data)); // déjà un tableau
  } else {
    return this.http.get<any>(this.jsonUrl).pipe(
      map(res => res.terrain) // 🔥 correction ici
    );
  }
}

  // 🔹 Ajouter
  addTerrain(terrain: Terrain): Observable<Terrain[]> {
    return new Observable(observer => {
      this.getAllTerrain().subscribe((terrains: any) => {
        const list = terrains.terrain || terrains;

        terrain.id = Date.now(); // id unique
        list.push(terrain);

        localStorage.setItem(this.storageKey, JSON.stringify(list));

        observer.next(list);
        observer.complete();
      });
    });
  }

  // 🔹 Update
  updateTerrain(id: number, updated: Terrain): Observable<Terrain[]> {
    return new Observable(observer => {
      this.getAllTerrain().subscribe((terrains: any) => {
        let list = terrains.terrain || terrains;

        list = list.map((t: Terrain) =>
          t.id === id ? { ...updated, id } : t
        );

        localStorage.setItem(this.storageKey, JSON.stringify(list));

        observer.next(list);
        observer.complete();
      });
    });
  }

  // 🔹 Delete
  deleteTerrain(id: number): Observable<Terrain[]> {
    return new Observable(observer => {
      this.getAllTerrain().subscribe((terrains: any) => {
        let list = terrains.terrain || terrains;

        list = list.filter((t: Terrain) => t.id !== id);

        localStorage.setItem(this.storageKey, JSON.stringify(list));

        observer.next(list);
        observer.complete();
      });
    });
  }
}