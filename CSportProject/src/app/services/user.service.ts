import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { User } from '../User';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //When calling these methods, make sure you subscribe to them in your code
  //Example: this.userService.getAllUsers().subscribe();

  //To fill an array from the subscribe, call it like this:
  //Example:  this.userService.getAllUsers().subscribe(users => this.users = users);
  //where this.users is a local array
  //For an example, see admin-dashboard.component.ts line 38

  private serverURL = 'http://localhost:3000';

  user$!: Observable<User[]> | null;

  users$!: Observable<User[]> | null;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.serverURL + "/usercollections")
  }

  getAllUsers2(): Observable<User[]> {
    if (!this.users$) {
      this.users$ = this.http.get<User[]>(this.serverURL + "/usercollections").pipe(tap(), shareReplay(1), tap());
    }

    return this.users$;
  }

  getUser(ID?: string): Observable<User[]> {
    return this.http.get<User[]>(this.serverURL + "/GetOneUser/" + ID, httpOptions);
  }

  getUser2(ID?: string): Observable<User[]> {
    if (!this.user$) {
      this.user$ = this.http.get<User[]>(this.serverURL + "/GetOneUser/" + ID, httpOptions).pipe(tap(), shareReplay(1), tap());
    }
    return this.user$;
  }

  public clearUserData() {
    this.user$ = null;
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.serverURL + "/userscollection", user, httpOptions);
  }

  editUser(user: User): Observable<User> {
    return this.http.put<User>(this.serverURL + "/EditUser", user, httpOptions);
  }

  deleteUser(ID: string): Observable<User> {
    return this.http.delete<User>(this.serverURL + "/DeleteUser/" + ID, httpOptions);
  }

  deleteUser2(ID: string): Observable<User> {
    return this.http.delete<User>(this.serverURL + "/DeleteUser2/" + ID, httpOptions);
  }

  getMongoStatus(): Observable<string> {
    return this.http.get<string>(this.serverURL + "/ConnectionStatus", httpOptions);
  }
}