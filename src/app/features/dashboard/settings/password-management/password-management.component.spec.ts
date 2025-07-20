import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordManagementComponent } from './password-management.component';

describe('PasswordManagementComponent', () => {
  let component: PasswordManagementComponent;
  let fixture: ComponentFixture<PasswordManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
