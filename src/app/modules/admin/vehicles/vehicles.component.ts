import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';
import { VehiclesService } from './services/vehicles.service';
import { Vehicle } from './interfaces/vehicles.interfaces';
import { GenericVehicleDialogComponent } from './components/generic-vehicle-dialog/generic-vehicle-dialog.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule
],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent implements OnInit, AfterViewInit{
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public dialog = inject(MatDialog);
    private _vehiclesService = inject(VehiclesService);
    private _toastr = inject(ToastrService);
    displayedColumns: string[] = [
        'brand',
        'model',
        'vin',
        'plate',
        'purchase_date',
        'cost',
        'entry_date',
        'actions'
    ];
    vehiclesDataSource = new MatTableDataSource<Vehicle>([]);
  
    ngOnInit(): void {
      this.getVehicles();
    }

    ngAfterViewInit(): void {
      this.vehiclesDataSource.paginator = this.paginator;
      this.vehiclesDataSource.sort = this.sort;
    }

    getVehicles(): void {
      this._vehiclesService.getVehicles().subscribe({
        next: (vehicles: Vehicle[]) => {
          this.vehiclesDataSource.data = vehicles;
        },
        error: () => {
          this._toastr.error('Error fetching vehicles');
        },
      });
    }

    deleteVehicle(id: number): void {
      this._vehiclesService.deleteVehicle(id).subscribe({
        next: () => {
          this.vehiclesDataSource.data = this.vehiclesDataSource.data.filter((vehicle) => vehicle.id !== id);
        },
        error: (response) => {
          const detail = response.error && response.error.detail;
          this._toastr.error(detail || 'Error deleting vehicle');
        }
      });
    }

    openVehicleDialog(vehicle?: Vehicle): void {
      const dialogRef = this.dialog.open(GenericVehicleDialogComponent, {
        data: vehicle,
        autoFocus: false,
        disableClose: true,
        width: '800px'
      });
      dialogRef.afterClosed()
        .subscribe((result: Vehicle) => {
          if (result) {
            this.getVehicles();
          }
      })
    }
}
