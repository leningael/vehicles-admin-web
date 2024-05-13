import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from './services/dashboard.service';
import { DashboardMetrics } from './interfaces/dashboard.interfaces';
import { DateTime } from 'luxon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DriverAssignmentsService } from '../driver-assignments/services/driver-assignments.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DriverAssignment } from '../driver-assignments/interfaces/driver-assignments.interfaces';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule,
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private _dashboardService = inject(DashboardService);
    private _driverAssignmentsService = inject(DriverAssignmentsService);
    private _toastr = inject(ToastrService);

    dashboardMetrics: DashboardMetrics;
    todayDate: DateTime = DateTime.now();
    daysOptionsCtrl: FormControl = new FormControl('today');
    displayedColumns: string[] = [
        'driver',
        'vehicle',
        'route_name',
        'destination',
        'completed_successfully',
    ];
    assignmentsDataSource = new MatTableDataSource<DriverAssignment>([]);

    ngOnInit(): void {
        this.requestDashboardMetrics();
        this.requestAssignmentsByDate(this.todayDate.toISODate());
        this.daysOptionsCtrl.valueChanges.subscribe((value) => {
            switch (value) {
                case 'today':
                    this.requestAssignmentsByDate(this.todayDate.toISODate());
                    break;
                case 'tomorrow':
                    this.requestAssignmentsByDate(
                        this.todayDate.plus({ days: 1 }).toISODate()
                    );
                    break;
            }
        });
    }

    ngAfterViewInit(): void {
        this.assignmentsDataSource.paginator = this.paginator;
    }

    requestDashboardMetrics(): void {
        this._dashboardService.getDashboardMetrics().subscribe({
            next: (metrics) => {
                this.dashboardMetrics = metrics;
            },
            error: (error: any) => {
                this._toastr.error('Failed to load dashboard metrics');
            },
        });
    }

    requestAssignmentsByDate(travel_date: string): void {
        this._driverAssignmentsService
            .getActiveDriverAssignments(travel_date)
            .subscribe({
                next: (assignments) => {
                    this.assignmentsDataSource.data = assignments;
                },
                error: (error: any) => {
                    this._toastr.error('Failed to load driver assignments');
                },
            });
    }
}
