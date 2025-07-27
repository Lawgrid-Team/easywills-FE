import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationStepsComponent } from './validation-steps.component';

describe('ValidationStepsComponent', () => {
  let component: ValidationStepsComponent;
  let fixture: ComponentFixture<ValidationStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationStepsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
