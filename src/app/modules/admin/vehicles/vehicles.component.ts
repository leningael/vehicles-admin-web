import { Component, ViewChild, inject } from '@angular/core';
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
import { MatSort } from '@angular/material/sort';
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
],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public dialog = inject(MatDialog);
    private _vehiclesService = inject(VehiclesService);
    private _toastr = inject(ToastrService);
    displayedColumns: string[] = [
        'id',
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
        this._vehiclesService.getVehicles().subscribe({
            next: (vehicles: Vehicle[]) => {
                this.vehiclesDataSource.data = vehicles;
            },
            error: () => {
                this._toastr.error('Error fetching vehicles');
            },
        });
    }

    ngAfterViewInit(): void {
      this.vehiclesDataSource.paginator = this.paginator;
    }

    getVehicles(): void {
      this._vehiclesService.getVehicles().subscribe({
        next: (vehicles: Vehicle[]) => {
          this.vehiclesDataSource.data = vehicles;
          this.vehiclesDataSource.paginator = this.paginator;
          this.vehiclesDataSource.sort = this.sort;
        },
        error: () => {
          this._toastr.error('Error fetching vehicles');
        },
      });
    }

    deleteVehicle(id: number): void {
      this._vehiclesService.deleteVehicle(id).subscribe({
        next: () => {
          const index = this.vehiclesDataSource.data.findIndex((vehicle) => vehicle.id === id);
          this.vehiclesDataSource.data.splice(index, 1);
          this.vehiclesDataSource._updateChangeSubscription();
          this._toastr.success('Vehicle deleted');
        },
        error: () => {
          this._toastr.error('Error deleting vehicle');
        },
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
