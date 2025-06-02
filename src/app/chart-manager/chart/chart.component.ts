import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { BaseChartDirective  } from 'ng2-charts';
import { ChartConfiguration} from 'chart.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartService } from '../services/chart.service';
import { AggregatedSaleContract } from '../models/aggregated-sale-contract';
import { FilterContract } from '../models/filter-contract';
import { IntervalType } from '../models/interval-type';
import { CapitalLetterPipe } from '../pipes/capital-letter.pipe';
import { Chart } from 'chart.js';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogAddSaleComponent } from '../dialog-add-sale/dialog-add-sale.component';
import { CreateSaleContract } from '../models/create-sale-contract';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    FormsModule,
    CapitalLetterPipe,
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  IntervalType = IntervalType;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  sales: AggregatedSaleContract[] = [];
  filter: FilterContract = {
    startDate: '2025-01-01',
    endDate: new Date().toISOString().split('T')[0],
    intervalType: IntervalType.Day
  };
  typeOptions = Object.values(IntervalType);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private chartService: ChartService,
    private dialog: MatDialog) {
    if (isPlatformBrowser(this.platformId)) {
      import('chartjs-plugin-zoom').then(module => {
        Chart.register(module.default);
      });
    }
  }

  ngOnInit(): void {
      this.getFilteredData();
  }

  getFilteredData() : void {
    this.chartService.getAggregatedSales(this.filter).subscribe(data => {
      this.sales = data;
      this.updateChartData();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddSaleComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result.date.toISOString(),);
        console.log(result.price)
        let sale: CreateSaleContract = {
          saleDateTime: result.date.toISOString(),
          amount: result.price
        };
        
      this.chartService.createSale(sale).subscribe({
        next: () => {
          console.log('Sale created successfully');
          this.getFilteredData();
        },
        error: (err) => {
          console.error('Error creating sale:', err);
        },
      });
      }
    });
  }

  public updateChartData(): void {
    const labels = this.sales.map(s => new Date(s.periodStart).toISOString().slice(0, 7));
    const sumData = this.sales.map(s => s.sumInThousands);
    const amountData = this.sales.map(s => s.totalCount);

    this.chartData.labels = labels;
    this.chartData.datasets[0].data = sumData;
    this.chartData.datasets[1].data = amountData;

    this.chart?.update();
  }

  resetZoom() {
    this.chart?.chart?.resetZoom();
  }

  public chartData: ChartConfiguration<'bar' | 'line'>['data'] = {
    labels: [],
    datasets: [
      {
        type: 'line',
        label: 'Sum(in Thousands)',
        data: [],
        borderColor: 'orange',
        backgroundColor: 'transparent',
        yAxisID: 'yLeft',
        tension: 0,
        fill: false,
      },
      {
        type: 'bar',
        label: 'Number of sales',
        data: [],
        borderColor: 'blue',
        backgroundColor: 'rgba(11, 93, 160, 0.16)',
        yAxisID: 'yRight',
      }
    ]
  };

  public chartOptions: ChartConfiguration<'bar' | 'line'>['options'] = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        title: { display: true, text: 'Time', font: { size: 18 } },
        ticks: { font: { size: 18 } },
      },
      yLeft: {
        position: 'left',
        title: { display: true, text: 'Sum(in Thousands)', font: { size: 18 } },
        ticks: { font: { size: 18 } },
      },
      yRight: {
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Number of sales', font: { size: 18 } },
        ticks: { font: { size: 18 } },
      },
    },
    plugins: {
          legend: {
            labels: { font: { size: 18, } }
          },
      zoom: {
        limits: {
          x: { min: 'original', max: 'original' },
          y: { min: 'original', max: 'original' },
        },
        pan: {
          enabled: true,
          mode: 'xy',
          threshold: 10,
          modifierKey: 'ctrl',
        },
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.05,
            modifierKey: 'ctrl',
          },
          pinch: { enabled: true },
          drag: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderColor: 'rgba(0,0,0,0.5)',
            borderWidth: 1,
          },
          mode: 'xy',
        },
      }
    }
  };
}