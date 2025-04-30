import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateFormComponent } from './real-estate-form.component';

describe('RealEstateFormComponent', () => {
  let component: RealEstateFormComponent;
  let fixture: ComponentFixture<RealEstateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealEstateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealEstateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
