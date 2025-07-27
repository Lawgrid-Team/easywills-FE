import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalVaultComponent } from './digital-vault.component';

describe('DigitalVaultComponent', () => {
  let component: DigitalVaultComponent;
  let fixture: ComponentFixture<DigitalVaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalVaultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
