import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { ChartService } from '../services/chart.service';
import { of } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { provideHttpClientTesting } from '@angular/common/http/testing';

beforeAll(() => {
  Chart.register(...registerables, zoomPlugin);
});

class MockChartService {
  getAggregatedSales() {
    return of([
      { periodStart: '2025-01-01', sumInThousands: 10, totalCount: 5 },
      { periodStart: '2025-02-01', sumInThousands: 20, totalCount: 15 },
    ]);
  }
}

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [ChartComponent],
    providers: [
      provideHttpClientTesting(),
      { provide: ChartService, useClass: MockChartService }
    ]
  }).compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sales data on init', () => {
    expect(component.sales.length).toBe(2);
    expect(component.sales[0].sumInThousands).toBe(10);
  });

  it('should update chart data based on sales', () => {
    component.updateChartData();

    expect(component.chartData.labels?.length).toBe(2);
    expect(component.chartData.datasets[0].data).toEqual([10, 20]);
    expect(component.chartData.datasets[1].data).toEqual([5, 15]);
  });

  it('should reset zoom by calling chart.resetZoom()', () => {
    component.chart = {
      chart: {
        resetZoom: jasmine.createSpy('resetZoom')
      }
    } as any;

    component.resetZoom();

    expect(component.chart!.chart!.resetZoom).toHaveBeenCalled();
  });

});