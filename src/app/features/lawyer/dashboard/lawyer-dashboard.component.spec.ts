import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerDashboardComponent } from './lawyer-dashboard.component';

describe('LawyerDashboardComponent', () => {
    let component: LawyerDashboardComponent;
    let fixture: ComponentFixture<LawyerDashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LawyerDashboardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LawyerDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
