import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogAddSaleComponent } from './dialog-add-sale.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('DialogAddSaleComponent', () => {
  let component: DialogAddSaleComponent;
  let fixture: ComponentFixture<DialogAddSaleComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DialogAddSaleComponent>>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        DialogAddSaleComponent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAddSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should close dialog with data on add', () => {
    const date = new Date('2025-05-01');
    const price = 123.45;

    component.selectedDate = date;
    component.price = price;
    component.onAdd();

    expect(mockDialogRef.close).toHaveBeenCalledWith({ date, price });
  });

  it('should bind input values via ngModel', () => {
    const dateInput = fixture.debugElement.query(By.css('input[matInput]'));
    component.selectedDate = new Date('2025-05-01');
    component.price = 100;
    fixture.detectChanges();

    expect(component.selectedDate).toEqual(new Date('2025-05-01'));
    expect(component.price).toBe(100);
  });
});
