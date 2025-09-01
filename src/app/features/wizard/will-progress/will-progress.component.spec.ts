import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WillProgressComponent} from './will-progress.component';

describe('WillProgressComponent', () => {
    let component: WillProgressComponent;
    let fixture: ComponentFixture<WillProgressComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WillProgressComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(WillProgressComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
