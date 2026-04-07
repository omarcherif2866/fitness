// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
// import { Role, User } from '../models/user.models';
// import {jwtDecode} from "jwt-decode";
// import { JwtHelperService } from '@auth0/angular-jwt';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//    private apiUrl="https://stellar-integrity-production.up.railway.app/api/auth";
//    private localStorageKey = "userAuth"; // Clé pour le localStorage
//    private jwtHelper: JwtHelperService;
//    private loggedIn = new BehaviorSubject<boolean>(false);

//    constructor(private httpClient:HttpClient) {
//     this.jwtHelper = new JwtHelperService();
//     const userData = localStorage.getItem(this.localStorageKey);
//     if (userData) {
//       const parsedData = JSON.parse(userData);
//       this.loggedIn.next(!!parsedData.accessToken); // Initialiser l'état de connexion
//     }
//     }

//     get isLoggedIn() {
//       return this.loggedIn.asObservable();
//     }

//    login(loginData: { username: string; password: string }): Observable<any> {
//     return this.httpClient.post<any>(`${this.apiUrl}/login`, loginData)
//       .pipe(
//         tap(response => {
//           // Sauvegarder l'utilisateur et le token dans le localStorage
//           localStorage.setItem(this.localStorageKey, JSON.stringify(response));
//           this.loggedIn.next(true);

//         }),
//         catchError(error => {
//           // Gérer les erreurs ici si nécessaire
//           console.error("Erreur de connexion:", error);
//           return throwError(error); // Relancer l'erreur pour que le composant traitant puisse la gérer
//         })
//       );
//   }

//   logout(): void {
//     // Supprimer l'utilisateur et le token du localStorage lors de la déconnexion
//     localStorage.removeItem(this.localStorageKey);
//   }

//   addUser(user: any): Observable<User> {
//     return this.httpClient.post<User>(this.apiUrl+"/register", user)
//   }

//   getToken(): string | null {
//     // Récupérer le token JWT depuis le localStorage
//     const currentUser = localStorage.getItem(this.localStorageKey);
//     return currentUser ? JSON.parse(currentUser).accessToken : null;
//   }

//   getRoleFromToken(token: string): string {
//     if (!token) {
//       return "vide"; // Ou une autre valeur par défaut appropriée
//     }
//     const decodedToken = this.decodeToken(token);
//     return decodedToken ? decodedToken.role : "";
//   }
  

//   private decodeToken(token: string): any {
//     if (!token) {
//       return null; // Ou une valeur par défaut appropriée
//     }
//     const tokenPayload = token.split('.')[1];
//     const decodedPayload = JSON.parse(atob(tokenPayload));
//     return decodedPayload;
//   }


//   getUserIdFromToken(): number | null {
//     const token = localStorage.getItem('accessToken');

//     if (token && !this.jwtHelper.isTokenExpired(token)) {
//       const decodedToken = this.jwtHelper.decodeToken(token);
//       return decodedToken.id; // Suppose que l'ID est stocké dans le token sous 'id'
//     }

//     return null;
//   }

//   storeUserIdFromToken(): void {
//     const token = localStorage.getItem('accessToken');

//     if (token && !this.jwtHelper.isTokenExpired(token)) {
//       const decodedToken = this.jwtHelper.decodeToken(token);
//       const userId = decodedToken.id; // Supposant que 'id' est la clé dans le token JWT contenant l'ID utilisateur
//       localStorage.setItem('userId', userId.toString());
//     }
//   }

//   // Méthode pour récupérer l'ID utilisateur depuis localStorage
//   getUserId(): number | null {
//     const userId = localStorage.getItem('userId');
//     return userId ? +userId : null; // Convertir en nombre si trouvé dans localStorage
//   }

  
//   updateUser(id: number, user: User): Observable<User> {
//     return this.httpClient.put<User>(`https://stellar-integrity-production.up.railway.app/api/auth/${id}`, user, {
//       headers: new HttpHeaders().set('Content-Type', 'application/json')
//     });
//   }
  
  
// }




import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user.models';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jsonUrl = 'assets/json/users.json'; // ← fichier local
  private localStorageKey = 'userAuth';
  private jwtHelper: JwtHelperService;
  private loggedIn = new BehaviorSubject<boolean>(false);

constructor(private httpClient: HttpClient) {
  this.jwtHelper = new JwtHelperService();

  const userData = localStorage.getItem(this.localStorageKey);

  if (userData) {
    try {
      const parsedData = JSON.parse(userData);
      this.loggedIn.next(!!parsedData.accessToken);
    } catch (error) {
      console.error('LocalStorage corrompu:', userData);
      localStorage.removeItem(this.localStorageKey); // nettoyage
      this.loggedIn.next(false);
    }
  }
}

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // ✅ Login depuis JSON local
  login(loginData: { username: string; password: string }): Observable<any> {
    return this.httpClient.get<any>(this.jsonUrl).pipe(
      map(data => {
        const user = data.users.find(
          (u: any) =>
            u.username === loginData.username &&
            u.password === loginData.password
        );

        if (user) {
          const response = {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            accessToken: user.accessToken
          };
          localStorage.setItem(this.localStorageKey, JSON.stringify(response));
          this.loggedIn.next(true);
          return response;
        } else {
          throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
        }
      }),
      catchError(error => {
        console.error('Erreur de connexion:', error);
        return throwError(() => error);
      })
    );
  }

  // ✅ Inscription : ajoute dans le JSON (simulation en mémoire uniquement)
  addUser(user: any): Observable<User> {
    return this.httpClient.get<any>(this.jsonUrl).pipe(
      map(data => {
        const exists = data.users.find((u: any) => u.username === user.username);
        if (exists) {
          throw new Error('Utilisateur déjà existant');
        }
        // Note : on ne peut pas écrire dans un fichier JSON côté client
        // Les données ne seront pas persistées (simulation uniquement)
        const newUser: User = { ...user, id: Date.now() };
        return newUser;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.localStorageKey);
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    const currentUser = localStorage.getItem(this.localStorageKey);
    return currentUser ? JSON.parse(currentUser).accessToken : null;
  }

  getRoleFromToken(token: string): string {
    if (!token) return 'vide';
    const decodedToken = this.decodeToken(token);
    return decodedToken ? decodedToken.role : '';
  }

  private decodeToken(token: string): any {
    if (!token) return null;
    try {
      const tokenPayload = token.split('.')[1];
      return JSON.parse(atob(tokenPayload));
    } catch {
      return null;
    }
  }

  getUserId(): number | null {
    const userData = localStorage.getItem(this.localStorageKey);
    if (userData) {
      return JSON.parse(userData).id || null;
    }
    return null;
  }

  updateUser(id: number, user: User): Observable<User> {
    // Simulation : retourne l'utilisateur modifié sans appel réseau
    return new Observable(observer => {
      observer.next({ ...user, id });
      observer.complete();
    });
  }

  // ✅ Récupérer tous les utilisateurs (utile pour un admin)
  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<any>(this.jsonUrl).pipe(
      map(data => data.users)
    );
  }

storeUserIdFromToken(): void {
  const currentUser = localStorage.getItem(this.localStorageKey);

  if (currentUser) {
    const parsed = JSON.parse(currentUser);
    const token = parsed.accessToken;

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const userId = decodedToken.id;
      localStorage.setItem('userId', userId.toString());
    }
  }
}
}