import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { PricingComponent } from './pricing.component';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PricingComponent', () => {
    let component: PricingComponent;
    let fixture: ComponentFixture<PricingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PricingComponent, MatIconModule, NoopAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(PricingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle tier expansion', () => {
        // Initially 'free' tier should be expanded
        expect(component.expandedTier).toBe('free');

        // Toggle 'legacy' tier
        component.toggleTier('legacy');
        expect(component.expandedTier).toBe('legacy');

        // Toggle 'legacy' tier again should collapse it
        component.toggleTier('legacy');
        expect(component.expandedTier).toBe('');

        // Toggle 'free' tier
        component.toggleTier('free');
        expect(component.expandedTier).toBe('free');
    });
});
