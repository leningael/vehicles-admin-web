import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationCodesComponent } from './invitation-codes.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('InvitationCodesComponent', () => {
  let component: InvitationCodesComponent;
  let fixture: ComponentFixture<InvitationCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationCodesComponent, HttpClientModule, ToastrModule.forRoot()],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvitationCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
