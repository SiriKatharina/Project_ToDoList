import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TodoListService } from './todo-list.service';

describe('TodoListService', () => {
  let service: TodoListService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoListService]
    });
    service = TestBed.inject(TodoListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrive todos from the API via GET', () => {
    const dummyTodos = [{ id: 1, name: 'Test', description: 'Test description', prio: 'high', status: 0 },
    { id: 2, name: 'Test', description: 'Test description', prio: 'high', status: 0 }];

    service.getData().subscribe(todos => {
      expect(todos.length).toBe(2);
      expect(todos).toBe(dummyTodos);
    });

    const request = httpMock.expectOne('http://localhost:3300/todoelements');

    expect(request.request.method).toBe('GET');
    request.flush(dummyTodos);

  });

  //Test case 1
  it('should add an todo and return it', () => {
    const newTodo = { id: 1, name: 'Test', description: 'Test description', prio: 'high', status: 0 };

    service.postData(newTodo).subscribe(
      data => expect(data).toEqual(newTodo, 'should return the employee'),
      fail
    );

    // addEmploye should have made one request to POST employee
    const req = httpMock.expectOne('http://localhost:3300/todoelements');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newTodo);

    // Expect server to return the employee after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: newTodo });
    req.event(expectedResponse);
  });

  it('should update an todo and return it', () => {
    const newTodo = { id: 1, name: 'Test', description: 'Test description', prio: 'high', status: 0 };

    service.updateData(newTodo).subscribe(
      data => expect(data).toEqual(newTodo, 'should return the employee'),
      fail
    );

    // addEmploye should have made one request to POST employee
    const req = httpMock.expectOne(`${"http://localhost:3300/todoelements"}/${newTodo.id}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(newTodo);

    // Expect server to return the employee after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: newTodo });
    req.event(expectedResponse);
  });

  it('should delte an todo', () => {
    const id = 1;

    service.deleteData(id).subscribe(
      data => expect(data).toEqual(null, 'should return the employee'),
      fail
    );

    // addEmploye should have made one request to POST employee
    const req = httpMock.expectOne(`${"http://localhost:3300/todoelements"}/${id}`);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(null);

    // Expect server to return the employee after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: null });
    req.event(expectedResponse);
  });

  it('should update status of an todo ', () => {
    const id = 1;
    const status = 1;

    service.updateStatus(id, status).subscribe(
      data => expect(data).toEqual(null, 'should return the employee'),
      fail
    );

    // addEmploye should have made one request to POST employee
    const req = httpMock.expectOne(`${"http://localhost:3300/todoelements/updatestatus"}/${id}/${status}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(null);

    // Expect server to return the employee after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: null });
    req.event(expectedResponse);
  });
});
