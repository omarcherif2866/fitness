import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl="http://localhost:8090/users/";
 


  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrl + 'all');
  }

  addUser(user: User): Observable<User> {
    return this.httpClient.post<User>(this.apiUrl + 'registre', user);
  }

  deleteUser(id: number) {
    return this.httpClient.delete<User>(this.apiUrl + 'delete/' + id);
  }

  login(username: string, password: string): Observable<User> {
    const loginUrl = `${this.apiUrl}login?username=${username}&password=${password}`;
    return this.httpClient.get<User>(loginUrl);
  }


  getUserById(id: any): Observable<User> {
    return this.httpClient.get<User>(this.apiUrl+ id);
  }
  showuser(token:string ):Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + token,
    "Content-Type": "application/json"
  });
  return this.httpClient.get(this.apiUrl +'users/all',{headers :headers });
}

blockUser(userId: number): Observable<any> {
  return this.httpClient.put<any>(`${this.apiUrl}block/${userId}`, {});
}

unblockUser(userId: number): Observable<any> {
  return this.httpClient.put<any>(`${this.apiUrl}unblock/${userId}`, {});
}
}