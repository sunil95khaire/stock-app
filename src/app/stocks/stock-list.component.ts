import { Component, OnInit } from '@angular/core';
import { StockService } from './stock.service';
import { IStock } from './stock';
import { Observable } from 'rxjs';

function stockSubscriber(observer) {
  function generateStock() {
    setTimeout(() => {
      observer.next(stocksGlobal); 
      generateStock(); 
    }, 2000);
  }
  generateStock();  
}

const stockGenerator = new Observable(stockSubscriber);
var stocksGlobal: IStock[];
var isPositive: boolean = true;

@Component({
  selector: 'app-stocks',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})

export class StockListComponent implements OnInit {
  stocks: IStock[];
  filteredStocks: IStock[];
  errorMessage: string;
  filterBy: string;

  constructor(private _stockService: StockService) { }

  ngOnInit() {
    this._stockService.getStocks()
      .subscribe(stocks => {
        this.stocks = stocks;
        this.stocks.forEach(item => {
          calculatePercentage(item)
        });
        this.filteredStocks = this.stocks;
        stocksGlobal = this.filteredStocks;
      },
        error => this.errorMessage = <any>error);

        stockGenerator.subscribe({
      next(stocks) {
        this.stocksGlobal = stocks;
        let randNumber: number = isPositive ? Math.random() - 1 : Math.random() + 0.3;
        isPositive = !isPositive;

        this.stocksGlobal.forEach(stock => {
          stock.currentPrice += randNumber;
          calculatePercentage(stock);
        });
        this.filteredStocks = this.stocksGlobal;
      },
      complete() { console.log('Finished'); }
    });
  }

  SearchStock() {
    this.filteredStocks =  this.stocks.filter((stock: IStock) =>
      stock.symbol.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) !== -1);
  }
}

function calculatePercentage(stock: IStock) {
  stock.valueDate = new Date().toString();
  stock.percentChange = ((stock.currentPrice - stock.openingPrice) / stock.openingPrice) * 100;

  if (stock.openingPrice > stock.currentPrice) {
    stock.stockStatus = 'negative-stock';
  } else if (stock.openingPrice < stock.currentPrice) {
    stock.stockStatus = 'positive-stock';
  } else {
    stock.stockStatus = '';
  }
}