import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormGroup,
    ReactiveFormsModule,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
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
import { DateTime } from 'luxon';
import { Observable, ReplaySubject } from 'rxjs';

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
        MatProgressSpinnerModule,
    ],
    templateUrl: './generic-vehicle-dialog.component.html',
    styleUrl: './generic-vehicle-dialog.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class GenericVehicleDialogComponent {
    @ViewChild('pictureInput') pictureInput: ElementRef<HTMLLinkElement>;
    private _dialogRef = inject(MatDialogRef<GenericVehicleDialogComponent>);
    private _toastr = inject(ToastrService);
    private _vehicleService = inject(VehiclesService);
    private _formBuilder = inject(UntypedFormBuilder);
    public data: Vehicle = inject(MAT_DIALOG_DATA);
    public selectedImage: string | ArrayBuffer;
    public isDownloading: boolean = false;
    public action = this.data ? 'Edit' : 'Create';
    public vehicleForm: FormGroup = this._formBuilder.group({
        brand: [this.data ? this.data.brand : '', Validators.required],
        model: [this.data ? this.data.model : '', Validators.required],
        vin: [this.data ? this.data.vin : '', Validators.required],
        plate: [this.data ? this.data.plate : '', Validators.required],
        purchase_date: [
            this.data ? DateTime.fromISO(this.data.purchase_date) : '',
            Validators.required,
        ],
        cost: [this.data ? this.data.cost : '', Validators.required],
        picture: ['', Validators.required],
    });

    constructor() {
        this.data && this.downloadVehiclePicture(this.data.vin);
    }

    saveVehicle(): void {
        if (this.vehicleForm.invalid) {
            this.vehicleForm.markAllAsTouched();
            return;
        }
        if (this.data) {
            this.updateVehicle();
        } else {
            this.createVehicle();
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

    createVehicle(): void {
        this._vehicleService.createVehicle(this.vehicleForm.value).subscribe({
            next: (newVehicle: Vehicle) => {
                this._toastr.success('Vehicle created');
                this._dialogRef.close(newVehicle);
            },
            error: (response) => {
                const detail = response.error && response.error.detail;
                this._toastr.error(detail || 'Error creating vehicle');
            },
        });
    }

    updateVehicle(): void {
        this._vehicleService
            .updateVehicle(this.data.id, this.vehicleForm.value)
            .subscribe({
                next: (updatedVehicle: Vehicle) => {
                    this._toastr.success('Vehicle updated');
                    this._dialogRef.close(updatedVehicle);
                },
                error: (response) => {
                    const detail = response.error && response.error.detail;
                    this._toastr.error(detail || 'Error updating vehicle');
                },
            });
    }

    downloadVehiclePicture(vin: string): any {
        this.isDownloading = true;
        this._vehicleService.downloadPicture(vin).subscribe((data: Blob) => {
            this.createImageFromBlob(data);
        });
    }

    createImageFromBlob(image: Blob): void {
        const reader = new FileReader();
        reader.addEventListener(
            'load',
            () => {
                this.selectedImage = reader.result;
                const base64String = this.selectedImage?.toString().split(',')[1];
                this.vehicleForm.get('picture')?.setValue(base64String);
                this.isDownloading = false;
            },
            false
        );

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    closeDialog(): void {
        this._dialogRef.close();
    }
}
