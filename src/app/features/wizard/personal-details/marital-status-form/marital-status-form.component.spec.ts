import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaritalStatusFormComponent } from './marital-status-form.component';

describe('MaritalStatusFormComponent', () => {
  let component: MaritalStatusFormComponent;
  let fixture: ComponentFixture<MaritalStatusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaritalStatusFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaritalStatusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
