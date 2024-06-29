import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Terrain } from '../models/terrain';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TerrainService {

  private apiUrl="http://localhost:8090/terrain";

  constructor(private httpClient: HttpClient) { }

  addTerrain(terrainData: any): Observable<Terrain> {
    return this.httpClient.post<Terrain>(this.apiUrl, terrainData)
      .pipe(
        catchError(this.handleError) // Gestion des erreurs
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Erreur:', error);
    throw error;
  }

  getAllTerrain(): Observable<Terrain[]> {
    return this.httpClient.get<Terrain[]>(this.apiUrl + '/allTerrain');
  }

  deleteTerrain(id: number) {
    return this.httpClient.delete<Terrain>(this.apiUrl + '/' + id);
  }
  
  updateTerrain(id: number, data: Terrain): Observable<Terrain> {
    return this.httpClient.put<Terrain>(this.apiUrl + '/' + id, data);
  }
}
