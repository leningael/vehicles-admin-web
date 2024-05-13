import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from '../../interfaces/vehicles.interfaces';
import { ToastrService } from 'ngx-toastr';
import { VehiclesService } from '../../services/vehicles.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-generic-vehicle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './generic-vehicle-dialog.component.html',
  styleUrl: './generic-vehicle-dialog.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class GenericVehicleDialogComponent implements OnInit {
  @ViewChild('pictureInput') pictureInput: ElementRef<HTMLLinkElement>;
  public dialogRef = inject(MatDialogRef<GenericVehicleDialogComponent>);  
  public data: Vehicle = inject(MAT_DIALOG_DATA);
  private _toastr = inject(ToastrService);
  public selectedImage: string | ArrayBuffer;
  public isDownloading: boolean = false;
  private _vehicleService = inject(VehiclesService);
  private _formBuilder = inject(UntypedFormBuilder);
  public vehicle: Vehicle;
  public action = this.data ? 'Edit' : 'Create';
  public vehicleForm: FormGroup = this._formBuilder.group({
    id: [this.data ? this.data.id : ''],
    brand: [this.data ? this.data.brand : '', Validators.required],
    model: [this.data ? this.data.model : '', Validators.required],
    vin: [this.data ? this.data.vin : '', Validators.required],
    plate: [this.data ? this.data.plate : '', Validators.required],
    purchase_date: [this.data ? this.data.purchase_date : '', Validators.required],
    cost: [this.data ? this.data.cost : '', Validators.required],
    picture: [this.data ? this.data.picture : '', Validators.required],
    entry_date: [this.data ? this.data.entry_date : '', Validators.required]
  });

  ngOnInit(): void {
    this.data && this.downloadVehiclePicture(this.data.vin);
  }

  saveVehicle(): void {
    this.vehicleForm.markAllAsTouched();
    if (!this.vehicleForm.valid) return;
    this.vehicle = this.vehicleForm.value;
    if (this.data) {
      this.updateVehicle(this.vehicle);
    } else {
      this.createVehicle(this.vehicle);
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.encodeImageFileAsBase64(file); // Optional: Encode to base64 if needed
    }
  }

  encodeImageFileAsBase64(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.selectedImage = reader.result;
      const base64String = this.selectedImage?.toString().split(',')[1]; // Extract base64 data
      this.vehicleForm.get('picture')?.setValue(base64String);
    };
    reader.readAsDataURL(file);
  }

  createVehicle(vehicle: Vehicle): void {
    this._vehicleService.createVehicle(vehicle).subscribe({
      next: (newVehicle: Vehicle) => {
        this._toastr.success('Vehicle created');
        this.dialogRef.close(newVehicle);
      },
      error: () => {
        this._toastr.error('Error creating vehicle');
      },
    });
  }

  updateVehicle(vehicle: Vehicle): void {
    this._vehicleService.updateVehicle(vehicle).subscribe({
      next: (updatedVehicle: Vehicle) => {
        this._toastr.success('Vehicle updated');
        this.dialogRef.close(updatedVehicle);
      },
      error: () => {
        this._toastr.error('Error updating vehicle');
      },
    });
  }

  downloadVehiclePicture(vin: string): any {
    this.isDownloading = true;
    this._vehicleService.downloadPicture(vin)
      .subscribe((data: Blob) => {
        this.createImageFromBlob(data);
      });
  }

  createImageFromBlob(image: Blob): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.selectedImage = reader.result;
      this.isDownloading = false;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
