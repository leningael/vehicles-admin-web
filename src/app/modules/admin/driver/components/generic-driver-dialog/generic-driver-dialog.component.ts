import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Driver } from '../../interfaces/driver.interfaces';
import { DriverService } from '../../services/driver.service';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';


@Component({
  selector: 'generic-driver-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  templateUrl: './generic-driver-dialog.component.html'
})
export class GenericDriverDIalogComponent {
  public dialogRef = inject(MatDialogRef<GenericDriverDIalogComponent>);  
  public data: Driver = inject(MAT_DIALOG_DATA);
  private _toastr = inject(ToastrService);
  private _driverService = inject(DriverService);
  private _formBuilder = inject(UntypedFormBuilder);
  public driver: Driver;
  public action = this.data ? 'Edit' : 'Create';
  public driverForm: FormGroup = this._formBuilder.group({
    id: [this.data ? this.data.id : ''],
    name: [this.data ? this.data.name : '', Validators.required],
    last_name: [this.data ? this.data.last_name : '', Validators.required],
    birth_date: [this.data ? this.data.birth_date : '', Validators.required],
    curp: [this.data ? this.data.curp : '', Validators.required],
    address: [this.data ? this.data.address : '', Validators.required],
    monthly_salary: [this.data ? this.data.monthly_salary : '', Validators.required],
    driving_license: [this.data ? this.data.driving_license : '', Validators.required],
    registration_date: [this.data ? this.data.registration_date : '']
  });

  saveDriver(): void {
    if (!this.data) this.setRegistrationDate();
    this.driverForm.markAllAsTouched();
    if (!this.driverForm.valid) return;
    this.driver = this.driverForm.value;
    if (this.data) {
      this.updateDriver(this.driver);
    } else {
      this.createDriver(this.driver);
    }
  }

  setRegistrationDate(): void {
    let registrationDate = new Date().toISOString().split('T')[0];
    this.driverForm.get('registration_date').setValue(registrationDate);
  }

  createDriver(driver: Driver): void {
    this._driverService.createDriver(driver).subscribe({
      next: (newDriver: Driver) => {
        this._toastr.success('Driver created');
        this.dialogRef.close(newDriver);
      },
      error: () => {
        this._toastr.error('Error creating driver');
      },
    });
  }

  updateDriver(driver: Driver): void {
    this._driverService.updateDriver(driver).subscribe({
      next: (updatedDriver: Driver) => {
        this._toastr.success('Driver updated');
        this.dialogRef.close(updatedDriver);
      },
      error: () => {
        this._toastr.error('Error updating driver');
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
