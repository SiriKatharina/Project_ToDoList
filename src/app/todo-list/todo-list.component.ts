import { Component, OnInit } from '@angular/core';
import { Todo } from '../service/todo';
import { TodoListService } from '../service/todo-list.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  public todoName = '';
  public todoDescription = '';
  public todoPrio = '';
  public todoDueDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  public showDone = false;
  todo = {name}
  todolist:any;
  updateMode = false;
  editedItemId = 0;
  constructor(public todoListService: TodoListService) { }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(){
    console.log('getPosts');
    this.todoListService.getData().subscribe(

      todolists=>{
        console.log(todolists);
      //*fill local Observable

      this.todoListService.TodoListServiceBS.next(todolists);

      //*connect to local Angular Model Database

      this.todolist=todolists;

      //----</ ngOnInit() >----
    }
    )
  }
  public addTodo(): void {
    if (this.todoDescription && this.todoDueDate) {
      if(!this.updateMode) {
      let todo = {name : '', description: '', prio:'', date:''};
      todo.name = this.todoName;
      todo.description = this.todoDescription;
      todo.prio = this.todoPrio;
      todo.date = this.todoDueDate;
      this.todoListService.postData(todo).subscribe(
        {
          next: (v) => this.getPosts(),
          error: (e) => console.error(e),
          complete: () => console.info('complete') 
         }
        )
      //this.todoListService.postData(this.todoName, this.todoDescription, this.todoPrio, new Date(this.todoDueDate));
      this.todoName = '';
      this.todoDescription = '';
      this.todoPrio = '';
      this.todoDueDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        } else {
          this.updateTodo(this.editedItemId);
        }
    }
  }

  public deleteTodo(id :number): void {
    this.todoListService.deleteData(id).subscribe(
      {
        next: (v) => this.getPosts(),
        error: (e) => console.error(e),
        complete: () => console.info('complete') 
       }
      )
  }

  editTodo(todo:any) {
    this.todoName = todo.name;
    this.todoDescription = todo.description;
    this.todoPrio = todo.prio;
    this.todoDueDate = todo.date;
    this.editedItemId = todo.id;
    this.updateMode = true;
  }

  toggleStatus(todo:any){
    let id = todo.id;
    let status = todo.status == 0 ? 1 :0;
    this.todoListService.updateStatus(id,status).subscribe(
      {
        next: (v) => this.getPosts(),
        error: (e) => console.error(e),
        complete: () => console.info('complete') 
       }
      )
  }

  updateTodo(id:any) {
    if (this.todoDescription && this.todoDueDate) {
      let todo = {id :id, name : this.todoName, description: this.todoDescription, prio:this.todoPrio, date:this.todoDueDate};
      this.todoListService.updateData(todo).subscribe(
        {
          next: (v) => {this.getPosts(); 
            this.updateMode = false;
            this.todoName = '';
            this.todoDescription = '';
            this.todoPrio = '';
            this.todoDueDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
          },
          error: (e) => console.error(e),
          complete: () => console.info('complete') 
         }
        )
      //this.todoListService.postData(this.todoName, this.todoDescription, this.todoPrio, new Date(this.todoDueDate));
     
    }
  }
}

    
