import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { delay, of } from 'rxjs';
import { TodoListService } from '../service/todo-list.service';

import { TodoListComponent } from './todo-list.component';

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

  it('should call delete a todo', fakeAsync(() => {
    let todoListService = fixture.debugElement.injector.get(TodoListService);
    let stub = spyOn(todoListService, 'deleteData').and.callFake(() => {
      return of({ "message": "Deletion was successful" }).pipe(delay(300));
    })
    component.deleteTodo(1);
    tick(300);
    stub.calls.mostRecent().returnValue.subscribe({
      next: (v) => {
        component.getPosts();
      }, error: (e) => console.error(e)
    });
    //expect('').toEqual('');
    // spyOn(component, 'getPosts').and.stub();

  }));

  it('should RESET Form', () => {
    component.resetForm();
    expect(component.todoName).toEqual('');
    expect(component.todoDescription).toEqual('');
    expect(component.todoPrio).toEqual('');
  });

});
