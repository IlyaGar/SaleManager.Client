import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AggregatedSaleContract } from '../models/aggregated-sale-contract';
import { environment } from '../../../environments/environment';
import { FilterContract } from '../models/filter-contract';
import { CreateSaleContract } from '../models/create-sale-contract';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private apiUrl = environment.apiUrl + '/sales';
  private urlGetChart = this.apiUrl + '/get-chart';
  private urlCreateSale = this.apiUrl + '/sale';
   
  constructor(private http: HttpClient) { }

  getAggregatedSales(data: FilterContract): Observable<AggregatedSaleContract[]> {
    return this.http.post<AggregatedSaleContract[]>(this.urlGetChart, data);
  }

  createSale(sale: CreateSaleContract): Observable<void> {
    return this.http.post<void>(this.urlCreateSale, sale);
  }
}
