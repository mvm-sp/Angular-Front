import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Customer } from '../models/customer';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customersUrl = 'http://localhost:8080/api/customers';  // URL to web api
  constructor( 
    private http: HttpClient
  ) { }

/*
  getCustomers (): Observable<Customer[]> {
    return this.http
      .get(this.customersUrl, {
      })
      // use the map() operator to return the data property of the response object
      // the operator enables us to map the response of the Observable stream
      // to the data value
      .pipe(
         map( res =>  res["payload"] as Customer[])
       );
  }
*/

  getCustomers (): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersUrl)
  }

  getCustomer(id: number): Observable<Customer> {
    const url = `${this.customersUrl}/${id}`;
    return this.http.get<Customer>(url);
  }

  addCustomer (customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.customersUrl, customer, httpOptions);
  }

  deleteCustomer (customer: Customer | number): Observable<Customer> {
    const id = typeof customer === 'number' ? customer : customer.id;
    const url = `${this.customersUrl}/${id}`;

    return this.http.delete<Customer>(url, httpOptions);
  }

  updateCustomer (customer: Customer): Observable<any> {
    return this.http.put(this.customersUrl, customer, httpOptions);
  }

  // default get page 1 and sort ascending by id column
  findCustomers(_sort = "id", _order = "ASC", _page = 0): Observable<Customer[]> {
    return this.http
      .get(this.customersUrl, {
        params: new HttpParams()
          .set("_sort", _sort)
          .set("_order", _order)
          .set("_page", _page.toString())
      })
      // use the map() operator to return the data property of the response object
      // the operator enables us to map the response of the Observable stream
      // to the data value
      .pipe(
         map( res =>  res as Customer[])
       );
  }
}