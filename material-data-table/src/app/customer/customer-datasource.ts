import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { MatPaginator, MatSort ,MatTableDataSource} from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge ,BehaviorSubject} from 'rxjs';
import { CustomerService } from '../services/customer.service';
import { Customer } from "../models/customer";






/**
 * Data source for the Customer view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class CustomerDataSource implements DataSource<Customer>{
  data: Customer[] ;
  
  
  private customersSubject = new BehaviorSubject<Customer[]>([]);
  get elements(): Customer[] { return this.customersSubject.value; }
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
 


  constructor(public paginator: MatPaginator, public sort: MatSort,private customersService: CustomerService) {}

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(CollectionViewer: CollectionViewer): Observable<Customer[]> {
    //this.data =this.loadCustomers();
  
    //console.log('Testando o Length...',new Date().getTime() ,this.data.length);
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.

        

        this.customersSubject.asObservable();

        // Combine everything that affects the rendered data into one update
        // stream for the data-table to consume.
        const dataMutations = [
          observableOf(this.data),
          this.paginator.page,
          this.sort.sortChange
        ];

        this.data =this.loadArrayCustomer();

        // Set the paginator's length
        this.paginator.length = this.elements.length;

        return merge(...dataMutations).pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data]));
        }));
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.customersSubject.complete();
    this.loadingSubject.complete();
  }
  
  loadCustomers() {
    this.loadingSubject.next(true);

    this.customersService
      .getCustomers()
      .subscribe(customers => this.customersSubject.next(customers)
      );
  }

  loadMutationCustomer(dataMutations:[]) : Observable<Customer[]> 
  {
    let objRet;
    this.loadingSubject.next(true);

    this.customersService
      .getCustomers()
      .subscribe
      (
        (list) => {
            list.map(item => {
              this.data.push(<Customer>item);
              //console.log('Testando o popula...',new Date().getTime() ,item);
          });
        },
        (error) => {
          console.log(error)
        }, // <- Handle the error here
        () => {
          this.paginator.length = this.data.length;
          objRet = merge(...dataMutations).pipe(map(() => {
            return this.getPagedData(this.getSortedData([...this.data]));
          }));
          console.log('Completed! ',new Date().getTime(),this.data.length )
        } 
      );
    return objRet;
  }

  loadArrayCustomer() : Customer[] 
  {
    let _array =[];
    this.loadingSubject.next(true);

    this.customersService
      .getCustomers()
      .subscribe
      (
        (list) => {
            list.map(item => {
              _array.push(<Customer>item);
              //console.log('Testando o popula...',new Date().getTime() ,item);
          });
        },
        (error) => {
          console.log(error)
        }, // <- Handle the error here
        () => {
          this.paginator.length = _array.length;
          console.log('Completed! ',new Date().getTime(),_array.length )
        } 
      );
    return _array;
  }

  getPageSize(){

    return 7;
  }
  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Customer[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Customer[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'firstname': return compare(a.firstname, b.firstname, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}


/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}