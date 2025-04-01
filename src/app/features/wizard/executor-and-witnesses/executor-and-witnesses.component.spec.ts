import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorAndWitnessesComponent } from './executor-and-witnesses.component';

describe('ExecutorAndWitnessesComponent', () => {
  let component: ExecutorAndWitnessesComponent;
  let fixture: ComponentFixture<ExecutorAndWitnessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutorAndWitnessesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorAndWitnessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
