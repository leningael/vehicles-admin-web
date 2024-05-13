import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverAssignment } from './interfaces/driver-assignments.interfaces';
import { DriverAssignmentsService } from './services/driver-assignments.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NewAssignmentFormComponent } from './components/new-assignment-form/new-assignment-form.component';

@Component({
    selector: 'app-driver-assignments',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        NewAssignmentFormComponent,
    ],
    templateUrl: './driver-assignments.component.html',
    styleUrl: './driver-assignments.component.scss',
})
export class DriverAssignmentsComponent implements OnInit, AfterViewInit {
    private _driverAssignmentsService = inject(DriverAssignmentsService);
    private _toastr = inject(ToastrService);
    private _dialog = inject(MatDialog);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = [
        'driver_id',
        'vehicle_id',
        'travel_date',
        'route_name',
        'destination',
        'completed_successfully',
        'actions',
    ];
    assignmentsDataSource = new MatTableDataSource<DriverAssignment>([]);

    ngOnInit(): void {
        this._driverAssignmentsService.getActiveDriverAssignments().subscribe({
            next: (assignments: DriverAssignment[]) => {
                this.assignmentsDataSource.data = assignments;
            },
            error: () => {
                this._toastr.error('Error fetching driver assignments');
            },
        });
    }

    ngAfterViewInit(): void {
        this.assignmentsDataSource.paginator = this.paginator;
        this.assignmentsDataSource.sort = this.sort;
    }

    getPendingAssignmentsCount(): number {
        return this.assignmentsDataSource.data.filter(
            (assignment) => !assignment.completed_successfully
        ).length;
    }

    getCompletedAssignmentsCount(): number {
        return this.assignmentsDataSource.data.filter(
            (assignment) => assignment.completed_successfully
        ).length;
    }

    openAssignmentDialog(assignment?: DriverAssignment): void {
        const dialofRef = this._dialog.open(NewAssignmentFormComponent, {
            width: '600px',
            maxHeight: '90vh',
            autoFocus: false,
            data: assignment || null,
        });
        dialofRef.afterClosed().subscribe((result) => {
            if (!result) return;
            if (assignment){            
                Object.assign(assignment, result);
            } else {
                this.assignmentsDataSource.data = [result, ...this.assignmentsDataSource.data];
            }     
        });
    }

    deleteAssignment(assignment: DriverAssignment) {
        this._driverAssignmentsService.deactivateDriverAssignment(assignment).subscribe({
            next: () => {
                this.assignmentsDataSource.data = this.assignmentsDataSource.data.filter(
                    (d_assignment) => d_assignment !== assignment
                );
            },
            error: (response) => {
                const detail = response.error && response.error.detail;
                this._toastr.error(detail || 'Error deleting assignment');
            }
        });
    }
}
