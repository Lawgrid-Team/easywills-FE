import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangePaymentMethodComponent } from './change-payment-method.component';

describe('ChangePaymentMethodComponent', () => {
    let component: ChangePaymentMethodComponent;
    let fixture: ComponentFixture<ChangePaymentMethodComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ChangePaymentMethodComponent,
                ReactiveFormsModule,
                RouterTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ChangePaymentMethodComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
