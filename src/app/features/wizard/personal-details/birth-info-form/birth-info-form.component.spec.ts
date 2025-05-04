import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthInfoFormComponent } from './birth-info-form.component';

describe('BirthInfoFormComponent', () => {
  let component: BirthInfoFormComponent;
  let fixture: ComponentFixture<BirthInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirthInfoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BirthInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
