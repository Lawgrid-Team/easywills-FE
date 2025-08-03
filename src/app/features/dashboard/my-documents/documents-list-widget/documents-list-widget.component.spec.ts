import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DocumentsListWidgetComponent } from './documents-list-widget.component';

describe('DocumentsListWidgetComponent', () => {
    let component: DocumentsListWidgetComponent;
    let fixture: ComponentFixture<DocumentsListWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocumentsListWidgetComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DocumentsListWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
