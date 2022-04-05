import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as express from 'express';

import { Todo } from './todo';
//import { app } from 'app/app';

//const baseUrl = 'http://localhost:3300/todoelements';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  public todos: Todo[] = [];
  headers = { 'content-type': 'application/json' };
  constructor(private http: HttpClient) { }

  public TodoListServiceBS = new BehaviorSubject<Object>(0);

  /** GET: get all todos from the database */
  getData(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:3300/todoelements")
  }

  /** POST: add a new todo to the database*/
  postData(todo: any): Observable<any> {
    return this.http.post("http://localhost:3300/todoelements", todo, { 'headers': this.headers })
  }

  /** PUT: update a todo in the database*/
  updateData(todo: any): Observable<any> {
    console.log(todo.id);
    return this.http.put(`${"http://localhost:3300/todoelements"}/${todo.id}`, todo, { 'headers': this.headers });
  }

  /** DELETE: delete a todo from the database*/
  deleteData(id: number): Observable<any> {
    return this.http.delete(`${"http://localhost:3300/todoelements"}/${id}`);
  }

  /** DELETE: delete a todo from the database*/
  updateStatus(id: number, status: number): Observable<any> {
    return this.http.put(`${"http://localhost:3300/todoelements/updatestatus"}/${id}/${status}`, null, { 'headers': this.headers });
  }
}