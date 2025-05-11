import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDistributionFormComponent } from './asset-distribution-form.component';

describe('AssetDistributionFormComponent', () => {
    let component: AssetDistributionFormComponent;
    let fixture: ComponentFixture<AssetDistributionFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AssetDistributionFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AssetDistributionFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
