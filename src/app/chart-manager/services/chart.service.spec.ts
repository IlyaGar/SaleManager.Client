import { TestBed } from '@angular/core/testing';
import { ChartService } from './chart.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FilterContract } from '../models/filter-contract';
import { AggregatedSaleContract } from '../models/aggregated-sale-contract';
import { environment } from '../../../environments/environment';
import { IntervalType } from '../models/interval-type';
import { CreateSaleContract } from '../models/create-sale-contract';

describe('ChartService', () => {
  let service: ChartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Импорт для моков HTTP
      providers: [ChartService]
    });

    service = TestBed.inject(ChartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request and return aggregated sales data', () => {
    const mockFilter: FilterContract = {
      startDate: '2025-01-01',
      endDate: '2025-01-01',
      intervalType: IntervalType.Day
    };

    const mockResponse: AggregatedSaleContract[] = [
      { periodStart: '2025-01-01', sumInThousands: 10, totalCount: 5, intervalType: IntervalType.Day },
      { periodStart: '2025-02-01', sumInThousands: 20, totalCount: 15, intervalType: IntervalType.Month },
    ];

    service.getAggregatedSales(mockFilter).subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/sales/get-chart');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockFilter);

    req.flush(mockResponse);
  });

  it('should send POST request to create a sale', () => {
    const mockSale: CreateSaleContract = {
      saleDateTime: '2025-06-01T12:00:00Z',
      amount: 1000
    };

    service.createSale(mockSale).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(environment.apiUrl + '/sales/sale');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSale);

    req.flush(null);
  });
});
