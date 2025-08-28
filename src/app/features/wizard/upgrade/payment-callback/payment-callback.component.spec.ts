import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCallbackComponent } from './payment-callback.component';

describe('PaymentSuccessfulComponent', () => {
  let component: PaymentCallbackComponent;
  let fixture: ComponentFixture<PaymentCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentCallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
