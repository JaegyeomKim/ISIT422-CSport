import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { Class } from '../Classes';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  //When calling these methods, make sure you subscribe to them in your code:
  //Example:  this.classesService.getAllClasses().subscribe();

  //To fill an array from the subscribe, call it like this:
  //Example:  this.classesService.getAllClasses().subscribe(classes => this.classes = classes);
  //where this.classes is a local array
  //For an example, see admin-dashboard.component.ts line 42

  private serverURL = 'http://localhost:3000';

  data$!: Observable<Class[]> | null;

  constructor(
    private http: HttpClient) { }

  getAllClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(this.serverURL + "/classcollections")
  }

  getAllClasses2(): Observable<Class[]> {
    if (!this.data$) {
      console.log('Called server for classes');
      this.data$ = this.http.get<Class[]>(this.serverURL + "/classcollections").pipe(tap(), shareReplay(1), tap());
    }
    return this.data$;
  }

  public clearClassData() {
    this.data$ = null;
  }

  getClass(CID?: string): Observable<Class[]> {
    return this.http.get<Class[]>(this.serverURL + "/GetOneClass/" + CID, httpOptions);
  }

  addClass(oneClass: Class): Observable<Class> {
    return this.http.post<Class>(this.serverURL + "/classcollections", oneClass, httpOptions);
  }

  editClass(oneClass: Class): Observable<Class> {
    return this.http.put<Class>(this.serverURL + "/EditClass", oneClass, httpOptions);
  }

  deleteClass(_id?: string): Observable<Class> {
    return this.http.delete<Class>(this.serverURL + "/DeleteClass/" + _id, httpOptions);
  }
}