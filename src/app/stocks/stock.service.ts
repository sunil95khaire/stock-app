import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { IStock } from './stock';

@Injectable({
  providedIn: 'root'
})

export class StockService {
  private _stockUrl = './api/stocks/stocks.json';

  constructor(private _http: HttpClient) { }

  getStocks(): Observable<IStock[]> {
    return  this._http.get<IStock[]>(this._stockUrl).pipe(tap(), catchError(this.handleError), );
  }

  private handleError(err) {
    return throwError(err);
  }
}
