import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateDistributionComponent } from './estate-distribution.component';

describe('EstateDistributionComponent', () => {
  let component: EstateDistributionComponent;
  let fixture: ComponentFixture<EstateDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstateDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstateDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
