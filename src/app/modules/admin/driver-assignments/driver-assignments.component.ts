import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DriverAssignment } from './interfaces/driver-assignments.interfaces';
import { DriverAssignmentsService } from './services/driver-assignments.service';
import { ToastrService } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-driver-assignments',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        MatPaginatorModule,
    ],
    templateUrl: './driver-assignments.component.html',
    styleUrl: './driver-assignments.component.scss',
})
export class DriverAssignmentsComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private _driverAssignmentsService = inject(DriverAssignmentsService);
    private _toastr = inject(ToastrService);
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
}
