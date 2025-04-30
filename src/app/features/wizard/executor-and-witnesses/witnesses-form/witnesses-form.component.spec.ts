import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WitnessesFormComponent } from './witnesses-form.component';

describe('WitnessesFormComponent', () => {
  let component: WitnessesFormComponent;
  let fixture: ComponentFixture<WitnessesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WitnessesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WitnessesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
