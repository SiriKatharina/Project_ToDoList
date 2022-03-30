import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Todo } from '../service/todo';
import { TodoListService } from '../service/todo-list.service';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, AfterViewInit {
  public todoName = '';
  public todoDescription = '';
  public todoPrio = 'Low';
  public todoDueDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  public showDone = false;
  todo = { name }
  todolist: any;
  // todolist: any[] = [{ id: 1, name: 'Test', description: 'Test description', prio: 'high', status: 0 },
  // { id: 2, name: 'Test', description: 'Test description', prio: 'high', status: 0 }];
  updateMode = false;
  editedItemId = 0;
  displayedColumns = ['id', 'name', 'description', 'priority', 'actions'];
  dataSource: MatTableDataSource<Todo>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public todoListService: TodoListService) { }

  ngOnInit(): void {
    this.getPosts();
    this.dataSource = new MatTableDataSource(this.todolist);
  }

  getPosts() {
    this.todoListService.getData().subscribe(
      todolists => {
        this.todolist = todolists;
      }
    );
  }

  public addTodo(): void {
    if (this.todoDescription && this.todoDueDate) {
      if (!this.updateMode) {
        let todo = { name: '', description: '', prio: '', date: '' };
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
        );
        this.resetForm();
      } else {
        this.updateTodo(this.editedItemId);
      }
    }
  }

  public deleteTodo(id: number): void {
    this.todoListService.deleteData(id).subscribe(
      {
        next: (v) => this.getPosts(),
        error: (e) => console.error(e),
        complete: () => console.info('complete')
      }
    )
  }

  editTodo(todo: any) {
    this.todoName = todo.name;
    this.todoDescription = todo.description;
    this.todoPrio = todo.prio;
    this.todoDueDate = todo.date;
    this.editedItemId = todo.id;
    this.updateMode = true;
  }

  toggleStatus(todo: any) {
    let id = todo.id;
    let status = todo.status == 0 ? 1 : 0;
    this.todoListService.updateStatus(id, status).subscribe(
      {
        next: (v) => this.getPosts(),
        error: (e) => console.error(e),
        complete: () => console.info('complete')
      }
    )
  }

  updateTodo(id: any) {
    if (this.todoDescription && this.todoDueDate) {
      let todo = { id: id, name: this.todoName, description: this.todoDescription, prio: this.todoPrio, date: this.todoDueDate };
      this.todoListService.updateData(todo).subscribe(
        {
          next: (v) => {
            this.getPosts();
            this.updateMode = false;
            this.resetForm();
          },
          error: (e) => console.error(e),
          complete: () => console.info('complete')
        }
      );
    }
  }

  resetForm() {
    this.todoName = '';
    this.todoDescription = '';
    this.todoPrio = '';
    this.todoDueDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}


