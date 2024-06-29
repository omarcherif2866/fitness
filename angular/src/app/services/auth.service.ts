import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Role, User } from '../models/user.models';
import {jwtDecode} from "jwt-decode";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private apiUrl="http://localhost:8090/api/auth";
   private localStorageKey = "userAuth"; // Clé pour le localStorage
   private jwtHelper: JwtHelperService;

   constructor(private httpClient:HttpClient) {
    this.jwtHelper = new JwtHelperService();
    }



   login(loginData: { username: string; password: string }): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          // Sauvegarder l'utilisateur et le token dans le localStorage
          localStorage.setItem(this.localStorageKey, JSON.stringify(response));
        }),
        catchError(error => {
          // Gérer les erreurs ici si nécessaire
          console.error("Erreur de connexion:", error);
          return throwError(error); // Relancer l'erreur pour que le composant traitant puisse la gérer
        })
      );
  }

  logout(): void {
    // Supprimer l'utilisateur et le token du localStorage lors de la déconnexion
    localStorage.removeItem(this.localStorageKey);
  }

  addUser(user: any): Observable<User> {
    return this.httpClient.post<User>(this.apiUrl+"/register", user)
  }

  getToken(): string | null {
    // Récupérer le token JWT depuis le localStorage
    const currentUser = localStorage.getItem(this.localStorageKey);
    return currentUser ? JSON.parse(currentUser).accessToken : null;
  }

  getRoleFromToken(token: string): string {
    if (!token) {
      return "vide"; // Ou une autre valeur par défaut appropriée
    }
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken.role : "";
  }
  

  private decodeToken(token: string): any {
    if (!token) {
      return null; // Ou une valeur par défaut appropriée
    }
    const tokenPayload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    return decodedPayload;
  }


  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('accessToken');

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.id; // Suppose que l'ID est stocké dans le token sous 'id'
    }

    return null;
  }

  storeUserIdFromToken(): void {
    const token = localStorage.getItem('accessToken');

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const userId = decodedToken.id; // Supposant que 'id' est la clé dans le token JWT contenant l'ID utilisateur
      localStorage.setItem('userId', userId.toString());
    }
  }

  // Méthode pour récupérer l'ID utilisateur depuis localStorage
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? +userId : null; // Convertir en nombre si trouvé dans localStorage
  }

  
  updateUser(id: number, user: User): Observable<User> {
    return this.httpClient.put<User>(`http://localhost:8090/api/auth/${id}`, user, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
  
  
}




