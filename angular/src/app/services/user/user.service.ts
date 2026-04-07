// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { User } from 'src/app/models/user.models';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private apiUrl="https://stellar-integrity-production.up.railway.app/users/";
 


//   constructor(private httpClient: HttpClient) { }

//   getAllUsers(): Observable<User[]> {
//     return this.httpClient.get<User[]>(this.apiUrl + 'all');
//   }

//   addUser(user: User): Observable<User> {
//     return this.httpClient.post<User>(this.apiUrl + 'registre', user);
//   }

//   deleteUser(id: number) {
//     return this.httpClient.delete<User>(this.apiUrl + 'delete/' + id);
//   }

//   login(username: string, password: string): Observable<User> {
//     const loginUrl = `${this.apiUrl}login?username=${username}&password=${password}`;
//     return this.httpClient.get<User>(loginUrl);
//   }


//   getUserById(id: any): Observable<User> {
//     return this.httpClient.get<User>(this.apiUrl+ id);
//   }
//   showuser(token:string ):Observable<any> {
//   const headers = new HttpHeaders({
//     'Authorization': 'Bearer ' + token,
//     "Content-Type": "application/json"
//   });
//   return this.httpClient.get(this.apiUrl +'users/all',{headers :headers });
// }

// blockUser(userId: number): Observable<any> {
//   return this.httpClient.put<any>(`${this.apiUrl}block/${userId}`, {});
// }

// unblockUser(userId: number): Observable<any> {
//   return this.httpClient.put<any>(`${this.apiUrl}unblock/${userId}`, {});
// }
// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private jsonUrl = 'assets/json/users.json';
  private storageKey = 'users';

  constructor(private http: HttpClient) {}

  // 🔹 GET ALL
  getAllUsers(): Observable<User[]> {
    const data = localStorage.getItem(this.storageKey);

    if (data) {
      return of(JSON.parse(data));
    } else {
      return this.http.get<any>(this.jsonUrl).pipe(
        map(res => res.users) // 🔥 important
      );
    }
  }

  // 🔹 ADD USER
  addUser(user: User): Observable<User[]> {
    return new Observable(observer => {
      this.getAllUsers().subscribe(users => {

        const exists = users.find(u => u.username === user.username);
        if (exists) {
          throw new Error('Utilisateur déjà existant');
        }

        user.id = Date.now();
        users.push(user);

        localStorage.setItem(this.storageKey, JSON.stringify(users));

        observer.next(users);
        observer.complete();
      });
    });
  }

  // 🔹 DELETE USER
  deleteUser(id: number): Observable<User[]> {
    return new Observable(observer => {
      this.getAllUsers().subscribe(users => {

        const updated = users.filter(u => u.id !== id);

        localStorage.setItem(this.storageKey, JSON.stringify(updated));

        observer.next(updated);
        observer.complete();
      });
    });
  }

  // 🔹 GET BY ID
  getUserById(id: any): Observable<User | undefined> {
    return new Observable(observer => {
      this.getAllUsers().subscribe(users => {
        const user = users.find(u => u.id === id);
        observer.next(user);
        observer.complete();
      });
    });
  }

  // 🔹 UPDATE USER
  updateUser(id: number, updatedUser: User): Observable<User[]> {
    return new Observable(observer => {
      this.getAllUsers().subscribe(users => {

        const updated = users.map(u =>
          u.id === id ? { ...updatedUser, id } : u
        );

        localStorage.setItem(this.storageKey, JSON.stringify(updated));

        observer.next(updated);
        observer.complete();
      });
    });
  }

  // 🔹 LOGIN (local)
  login(username: string, password: string): Observable<User | null> {
    return new Observable(observer => {
      this.getAllUsers().subscribe(users => {

        const user = users.find(
          u => u.username === username && u.password === password
        );

        observer.next(user || null);
        observer.complete();
      });
    });
  }

  // 🔹 BLOCK / UNBLOCK (simulation)
  blockUser(userId: number): Observable<User[]> {
    return new Observable(observer => {
      this.getAllUsers().subscribe(users => {

        const updated = users.map(u =>
          u.id === userId ? { ...u, blocked: true } : u
        );

        localStorage.setItem(this.storageKey, JSON.stringify(updated));

        observer.next(updated);
        observer.complete();
      });
    });
  }

  unblockUser(userId: number): Observable<User[]> {
    return new Observable(observer => {
      this.getAllUsers().subscribe(users => {

        const updated = users.map(u =>
          u.id === userId ? { ...u, blocked: false } : u
        );

        localStorage.setItem(this.storageKey, JSON.stringify(updated));

        observer.next(updated);
        observer.complete();
      });
    });
  }
}