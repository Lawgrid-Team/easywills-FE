import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardStepperComponent } from './wizard-stepper.component';

describe('WizardStepperComponent', () => {
  let component: WizardStepperComponent;
  let fixture: ComponentFixture<WizardStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WizardStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
