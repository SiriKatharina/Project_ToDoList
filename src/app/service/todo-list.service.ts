import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as express  from 'express';

import { Todo } from './todo';
//import { app } from 'app/app';

//const baseUrl = 'http://localhost:3300/todoelements';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  public todos: Todo[] = [];
  headers = { 'content-type': 'application/json'};  
  constructor(private http: HttpClient) { }

  public TodoListServiceBS=new BehaviorSubject<Object>(0);

  /** GET: get all todos from the database */
  getData() : Observable<any[]> {
    return this.http.get<any[]> ("http://localhost:3300/todoelements")
  }

  /** POST: add a new todo to the database*/
  postData(todo:any) : Observable<any> {
  return this.http.post("http://localhost:3300/todoelements", todo,{'headers': this.headers})
  } 

 /** PUT: update a todo in the database*/
 updateData(todo:Todo) : Observable<Todo[]> {
  return this.http.put<any[]>(`$"{http://localhost:3300/todoelements"}/${this.todos}`, todo);
  } 

   /** DELETE: delete a todo from the database*/
   deleteData(id:number) : Observable<any> {
    return this.http.delete(`${"http://localhost:3300/todoelements"}/${id}`);
    } 

  
/*
  public getTodos(done?: boolean): Todo[] {
    return this.todos
      .filter(t => done === undefined || (done && t.doneDate) || (!done && !t.doneDate))
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  public addTodo(name: string, description: string, prio: string, dueDate: Date): void {
    let newId = 0;
    if (this.todos.length) {
      newId = Math.max(...this.todos.map(t => t.id)) + 1;
    }

    this.todos.push({ id: newId, name: name, description: description, prio: prio, dueDate: dueDate });
  }

  public deleteTodoById(id: number): void {
    const index = this.todos.findIndex(t => t.id === id);
    if (index >= 0) {
      this.todos.splice(index, 1);
    }
  }

  public updateTodoById(id: number, name: string, description: string, prio: string, dueDate: Date): void {
    const index = this.todos.findIndex(t => t.id === id);
    if (index >= 0) {
      this.todos[index].name = name;
      this.todos[index].description = description;
      this.todos[index].prio = prio;
      this.todos[index].dueDate = dueDate;
    }
  }
*/
  public toggleDoneStateById(id: number): void {
    const index = this.todos.findIndex(t => t.id === id);
    if (index >= 0) {
      if (this.todos[index].doneDate) {
        this.todos[index].doneDate = undefined;
      } else {
        this.todos[index].doneDate = new Date();
      }
    }
  }




}