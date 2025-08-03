import { TestBed, ComponentFixture } from '@angular/core/testing';
import { OrganizationHubWidgetComponent } from './organization-hub-widget.component';

describe('OrganizationHubWidgetComponent', () => {
    let component: OrganizationHubWidgetComponent;
    let fixture: ComponentFixture<OrganizationHubWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrganizationHubWidgetComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OrganizationHubWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
