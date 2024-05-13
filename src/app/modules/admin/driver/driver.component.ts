import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverService } from './services/driver.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Driver } from './interfaces/driver.interfaces';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GenericDriverDIalogComponent } from './components/generic-driver-dialog/generic-driver-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'driver',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule, 
    MatSortModule
  ],
  templateUrl: './driver.component.html',
})
export class DriverComponent implements OnInit {
  private _toastr = inject(ToastrService);
  private _driverService = inject(DriverService);
  public driversTableColumns: string[] = ['name', 'last_name', 'birth_date', 'curp', 'address', 'monthly_salary', 'driving_license', 'registration_date', 'actions'];
  public driversDataSource: MatTableDataSource<Driver> = new MatTableDataSource();
  public dialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.getDrivers();
  }

  getDrivers(): void {
    this._driverService.getDrivers().subscribe({
      next: (drivers: Driver[]) => {
        this.driversDataSource.data = drivers;
        this.driversDataSource.paginator = this.paginator;
        this.driversDataSource.sort = this.sort;
      },
      error: () => {
        this._toastr.error('Error fetching drivers');
      },
    });
  }

  deleteDriver(id: number): void {
    this._driverService.deleteDriver(id).subscribe({
      next: () => {
        const index = this.driversDataSource.data.findIndex((driver) => driver.id === id);
        this.driversDataSource.data.splice(index, 1);
        this.driversDataSource._updateChangeSubscription();
        this._toastr.success('Driver deleted');
      },
      error: () => {
        this._toastr.error('Error deleting driver');
      },
    });
  }

  openDriverDialog(driver?: Driver): void {
    const dialogRef = this.dialog.open(GenericDriverDIalogComponent, {
      data: driver,
      autoFocus: false,
      disableClose: true,
      width: '450px'
    });
    dialogRef.afterClosed()
      .subscribe((result: Driver) => {
        if (result) {
          this.getDrivers();
        }
    })
  }
}
