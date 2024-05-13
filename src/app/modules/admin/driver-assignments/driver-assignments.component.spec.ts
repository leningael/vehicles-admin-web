import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverAssignmentsComponent } from './driver-assignments.component';

describe('DriverAssignmentsComponent', () => {
  let component: DriverAssignmentsComponent;
  let fixture: ComponentFixture<DriverAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverAssignmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DriverAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
