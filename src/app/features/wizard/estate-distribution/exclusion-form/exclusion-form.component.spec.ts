import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusionFormComponent } from './exclusion-form.component';

describe('ExclusionFormComponent', () => {
  let component: ExclusionFormComponent;
  let fixture: ComponentFixture<ExclusionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExclusionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExclusionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
