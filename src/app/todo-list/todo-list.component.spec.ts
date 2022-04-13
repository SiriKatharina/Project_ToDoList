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

  it('should delte a todo', () => {
    let todoListService = fixture.debugElement.injector.get(TodoListService);
    spyOn(todoListService, 'deleteData').and.returnValue(of({ 'message': 'Deltetion was successful' }));
    spyOn(component, 'getPosts');

    component.deleteTodo(1);

    expect(todoListService.deleteData).toHaveBeenCalled();
    expect(component.getPosts).toHaveBeenCalled();
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

  // it('should add a new todo to the todo-List over a post', fakeAsync(() => {
  //   let todoListService = fixture.debugElement.injector.get(TodoListService); // mock from the class TodoListService
  //   let stub = spyOn(todoListService, 'postData').and.callFake(() => {
  //     return of({ "message": "Insertion was successful" }).pipe(delay(300));
  //   })
  //   stub.calls.mostRecent().returnValue.subscribe({
  //     next: (v) => {
  //       component.addTodo();
  //     }, error: (e) => console.error(e)
  //   });
  //   //component.addTodo(); //--> call the Method add a todo
  //   tick(300);
  //   //fixture.detectChanges();
  //   //const compiled = fixture.debugElement.nativeElement;

  //   //expect(compiled.innerHTML).toContain([{"message": "Insertion was successful"}]);
  //   expect(component.addTodo).toEqual([{ message: "Insertion was successful" }]); // what should I expected?
  // })); //--> equal to the String? possible? 


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

  // it('update todo, should save the new data in the database from the updated todo', fakeAsync(() => {
  //   let todoListService = fixture.debugElement.injector.get(TodoListService);
  //   let stub = spyOn(todoListService, 'postData').and.callFake(() => {
  //     return of({ "message": "Update was successful" }).pipe(delay(300));
  //   })
  //   let todo = { id: 1, name: "test", description: "testD", prio: "1", date: 2022 - 22 - 10, status: 0 };
  //   component.updateTodo(todo); //--> call the Method add a todo
  //   tick(300);
  //   stub.calls.mostRecent().returnValue.subscribe({
  //     next: (v) => {
  //       component.updateTodo(todo);
  //     }, error: (e) => console.error(e)
  //   });
  //   expect(component.todolist).toEqual([{ "message": "Update was successful" }]);
  // }));


  it('should toggle the Status in a todo', () => {
    let todo = { id: 1, status: 1 };
    component.toggleStatus(todo);
    expect(component.showDone).toEqual(false);
  });


});
