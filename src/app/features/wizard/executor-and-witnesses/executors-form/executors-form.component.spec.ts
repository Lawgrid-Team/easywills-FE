import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutorsFormComponent } from './executors-form.component';

describe('ExecutorsFormComponent', () => {
  let component: ExecutorsFormComponent;
  let fixture: ComponentFixture<ExecutorsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutorsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
