import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericVehicleDialogComponent } from './generic-vehicle-dialog.component';

describe('GenericVehicleDialogComponent', () => {
  let component: GenericVehicleDialogComponent;
  let fixture: ComponentFixture<GenericVehicleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericVehicleDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericVehicleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
