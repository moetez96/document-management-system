import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUri: string = 'http://localhost:3000/api/document/';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  createDocument(data: any): Observable<any> {
    let url = this.baseUri + 'create';

    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }
  getFile(fileName: any) {
    return this.http.post(this.baseUri + "getFile", { file: fileName }, { responseType: "blob" });
  }
  getDocuments() {
    return this.http.get(this.baseUri);
  }

  getDocument(id: any): Observable<any> {
    let url = this.baseUri + id;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: any) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  updateDocument(id: any, data: any): Observable<any> {
    let url = this.baseUri + 'update/' + id;
    return this.http.put(url, data).pipe(
      catchError(this.errorMgmt)
    )
  }

  deleteDocument(id: any): Observable<any> {
    let url = this.baseUri + 'delete/' + id;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = 'Error Code:' + error.status + ' - Message:' + error.message;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
