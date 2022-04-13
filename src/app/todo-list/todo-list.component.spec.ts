import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { delay, Observable, of } from 'rxjs';
import { TodoListService } from '../service/todo-list.service';
import { Todo } from '../service/todo';

import { TodoListComponent } from './todo-list.component';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { error } from 'console';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  // let todolistServiceSpy: jasmine.SpyObj<TodoListService>;

  beforeEach(async () => {
    //  const todolistServiceSpyObj = jasmine.createSpyObj('TodoListService', ['getData']);
    await TestBed.configureTestingModule({
      declarations: [TodoListComponent],
      imports: [HttpClientModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule],
      // providers: [{ provide: TodoListService, useValue: todolistServiceSpyObj }]
    })
      .compileComponents();

    // fixture.detectChanges();
    //todolistServiceSpy = TestBed.get(TodoListService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPosts() and get response as array', fakeAsync(() => {
    let todoListService = fixture.debugElement.injector.get(TodoListService);
    let stub = spyOn(todoListService, 'getData').and.callFake(() => {
      return of([{ id: 1, name: 'Test', description: 'Test description', prio: 'high', status: 0 }]).pipe(delay(300));
    })
    component.getPosts();
    tick(300);
    expect(component.todolist).toEqual([{ id: 1, name: 'Test', description: 'Test description', prio: 'high', status: 0 }]);
  }));

  // it('should call delete a todo', fakeAsync(() => {
  //   const successResponse = { message: 'Deletion was successful' };
  //   let todoListService = fixture.debugElement.injector.get(TodoListService);
  //   let stub = spyOn(todoListService, 'deleteData').and.callFake(() => {
  //     return of({ "message": "Deletion was successful" }).pipe(delay(300));
  //   })


  //   //expect(todoListService.deleteData).toHaveBeenCalled();
  //   tick(400);
  //   stub.calls.mostRecent().returnValue.subscribe({
  //     next: (v) => {
  //       expect(successResponse).toEqual({ "message": "Deletion was successful" });
  //       expect(component.getPosts).toHaveBeenCalled();
  //     }
  //   });

  it('should delete a todo & return success', () => {
    let todoListService = fixture.debugElement.injector.get(TodoListService);
    spyOn(todoListService, 'deleteData').and.returnValue(of({ 'message': 'Deltetion was successful' }));
    spyOn(component, 'getPosts');

    component.deleteTodo(1);

    expect(todoListService.deleteData).toHaveBeenCalled();
    expect(component.getPosts).toHaveBeenCalled();
  })

  it('should delete a todo & return error', () => {
    let todoListService = fixture.debugElement.injector.get(TodoListService);
    spyOn(todoListService, 'deleteData').and.returnValue(throwError(() => new Error('Error')));
    component.deleteTodo(1);
    expect(todoListService.deleteData).toHaveBeenCalled();
  })

  //expect('').toEqual('');
  // spyOn(component, 'getPosts').and.stub();



  //  it('should call the delete method by click only once', () => {
  /*let todoListService = fixture.debugElement.injector.get(TodoListService);
  let mockSpy = jasmine.createSpyObj(['deleteTodo']);
  mockSpy.deleteTodo.and.returnValue(of(true));
 //component.getPosts = ;
  component.deleteTodo(1)
  /*
  spyOn(todoListService, 'deleteData').and.callFake(() => {
    return of({ "message": "Deletion was successful" }).pipe(delay(300));
  })
  component.deleteTodo(1);
  expect(mockSpy.deleteTodo).toHaveBeenCalledTimes(1);*/
  //});

  it('should add a new todo to the todo-List over a post & return SUCCESS', fakeAsync(() => {
    let todoListService = fixture.debugElement.injector.get(TodoListService); // mock from the class TodoListService
    spyOn(todoListService, 'postData').and.returnValue(of({ 'message': 'Insertion was successful' }));;
    console.log(component.updateMode);
    spyOn(component, 'getPosts');
    component.todoDescription = 'new';
    component.todoDueDate = '20/12/2022';
    component.addTodo();
    expect(component.todoDescription).toBeDefined();
    expect(component.todoDueDate).toBeDefined();
    expect(component.updateMode).toEqual(false);
    tick(3000);
    expect(todoListService.postData).toHaveBeenCalled();
    expect(component.getPosts).toHaveBeenCalled();
  }));


  it('should add a new todo to the todo-List over a post & return ERROR', fakeAsync(() => {
    let todoListService = fixture.debugElement.injector.get(TodoListService); // mock from the class TodoListService
    spyOn(todoListService, 'postData').and.returnValue(throwError(() => new Error('Error')));;
    component.todoDescription = 'new';
    component.todoDueDate = '20/12/2022';
    component.addTodo();
    expect(component.todoDescription).toBeDefined();
    expect(component.todoDueDate).toBeDefined();

    tick(3000);
    expect(todoListService.postData).toHaveBeenCalled();
    expect(component.updateMode).toEqual(false);
  }));

  it('should Update an existing todo over a put & return ERROR', fakeAsync(() => {
    let todoListService = fixture.debugElement.injector.get(TodoListService); // mock from the class TodoListService
    let todo = { id: 1, name: "test", description: "testD", prio: "1", date: "01.03.22", status: 1 };
    component.editTodo(todo);
    spyOn(todoListService, 'updateData').and.returnValue(throwError(() => new Error('Error')));;
    component.addTodo();
    expect(component.todoDescription).toBeDefined();
    expect(component.todoDueDate).toBeDefined();
    expect(component.updateMode).toEqual(true);
    tick(3000);
    expect(todoListService.updateData).toHaveBeenCalled();
  }));

  it('should Update an existing todo over a put & return SUCCESS', fakeAsync(() => {
    let todoListService = fixture.debugElement.injector.get(TodoListService); // mock from the class TodoListService
    spyOn(todoListService, 'updateData').and.returnValue(of({ message: 'Update was successful' }));;
    spyOn(component, 'getPosts');
    let todo = { id: 1, name: "test", description: "testD", prio: "1", date: "01.03.22", status: 1 };
    component.editTodo(todo);
    console.log('update Mode is ' + component.updateMode);
    component.addTodo();
    expect(component.todoDescription).toBeDefined();
    expect(component.todoDueDate).toBeDefined();
    tick(3000);
    expect(todoListService.updateData).toHaveBeenCalled();
    expect(component.getPosts).toHaveBeenCalled();
    expect(component.updateMode).toEqual(false);
  }));

  it('should RESET Form', () => {
    component.resetForm();
    expect(component.todoName).toEqual('');
    expect(component.todoDescription).toEqual('');
    expect(component.todoPrio).toEqual('');
  });

  it('edit todo', () => {
    let todo = { id: 1, name: "test", description: "testD", prio: "1", date: "01.03.22", status: 1 };
    component.editTodo(todo);
    expect(component.todoName).toEqual('test');
    expect(component.todoDescription).toEqual('testD');
    expect(component.todoPrio).toEqual('1');
    expect(component.todoDueDate).toEqual('2022-01-03'); //--> how to save the date? 
    expect(component.editedItemId).toEqual(1);
    expect(component.updateMode).toEqual(true);
  });

  it('should toggle the Status of a todo to Done & return SUCCESS', () => {
    let todoListService = fixture.debugElement.injector.get(TodoListService);
    spyOn(todoListService, 'updateStatus').and.returnValue(of({ 'message': 'update status was successful' }));
    spyOn(component, 'getPosts');
    let todo = { id: 1, status: 0 };
    component.toggleStatus(todo);
    expect(todoListService.updateStatus).toHaveBeenCalled();
    expect(component.getPosts).toHaveBeenCalled();
  });

  it('should toggle the Status of a todo to UnDone & return SUCCESS', () => {
    let todoListService = fixture.debugElement.injector.get(TodoListService);
    spyOn(todoListService, 'updateStatus').and.returnValue(of({ 'message': 'update status was successful' }));
    spyOn(component, 'getPosts');
    let todo = { id: 1, status: 1 };
    component.toggleStatus(todo);
    expect(todoListService.updateStatus).toHaveBeenCalled();
    expect(component.getPosts).toHaveBeenCalled();
  });

  it('should toggle the Status in a todo & return ERROR', () => {
    let todoListService = fixture.debugElement.injector.get(TodoListService);
    spyOn(todoListService, 'updateStatus').and.returnValue(throwError(() => new Error('Error')));
    let todo = {};
    component.toggleStatus(todo);
    expect(todoListService.updateStatus).toHaveBeenCalled();

  });

});
