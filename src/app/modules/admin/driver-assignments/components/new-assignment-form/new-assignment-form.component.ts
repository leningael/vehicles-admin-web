import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DriverAssignmentsService } from '../../services/driver-assignments.service';
import { Driver } from '../../interfaces/drivers.interfaces';
import { Vehicle } from '../../interfaces/vehicles.interfaces';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DateTime } from 'luxon';

@Component({
    selector: 'app-new-assignment-form',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatDividerModule,
        MatSlideToggleModule,
    ],
    templateUrl: './new-assignment-form.component.html',
    styleUrl: './new-assignment-form.component.scss',
})
export class NewAssignmentFormComponent implements OnInit {
    private _dialogRef = inject(MatDialogRef<NewAssignmentFormComponent>);
    private _formBuilder = inject(UntypedFormBuilder);
    private _toastr = inject(ToastrService);
    private _driverAssignmentsService = inject(DriverAssignmentsService);
    // public data: any = inject(MAT_DIALOG_DATA);
    assignmentForm: UntypedFormGroup = this._formBuilder.group({
        driver_id: [0, [Validators.required, Validators.min(1)]],
        vehicle_id: [0, [Validators.required, Validators.min(1)]],
        travel_date: [DateTime.now().startOf('day'), Validators.required],
        route_name: ['', Validators.required],
        origin_location: this._formBuilder.group({
            latitude: [0, Validators.required],
            longitude: [0, Validators.required],
        }),
        destination_location: this._formBuilder.group({
            latitude: [0, Validators.required],
            longitude: [0, Validators.required],
        }),
        completed_successfully: [false],
        problem_description: [''],
        comments: [''],
    });
    drivers: Driver[] = [];
    vehicles: Vehicle[] = [];

    ngOnInit(): void {}

    requestDrivers(): void {
        this._driverAssignmentsService.getDrivers().subscribe({
            next: (drivers: Driver[]) => {
                this.drivers = drivers;
            },
            error: () => {
                this._toastr.error('Error fetching drivers');
            },
        });
    }

    requestVehicles(): void {
        this._driverAssignmentsService.getVehicles().subscribe({
            next: (vehicles: any) => {
                this.vehicles = vehicles;
            },
            error: () => {
                this._toastr.error('Error fetching vehicles');
            },
        });
    }

    saveAssignment(): void {
        if (this.assignmentForm.invalid) {
            this.assignmentForm.markAllAsTouched();
            return;
        }
        this._driverAssignmentsService
            .createDriverAssignment(this.assignmentForm.value)
            .subscribe({
                next: (assignment) => {
                    this._toastr.success('Assignment saved successfully');
                    this._dialogRef.close(assignment);
                },
                error: (response) => {
                    const detail = response.error && response.error.detail;
                    this._toastr.error(
                        detail || 'Error saving assignment'
                    );
                },
            });
    }

    closeDialog(): void {
        this._dialogRef.close();
    }
}
