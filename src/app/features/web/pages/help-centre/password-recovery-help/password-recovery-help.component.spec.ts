import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRecoveryHelpComponent } from './password-recovery-help.component';

describe('PasswordRecoveryHelpComponent', () => {
  let component: PasswordRecoveryHelpComponent;
  let fixture: ComponentFixture<PasswordRecoveryHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRecoveryHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordRecoveryHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
