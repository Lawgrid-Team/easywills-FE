import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanUpgradeHelpComponent } from './plan-upgrade-help.component';

describe('PlanUpgradeHelpComponent', () => {
  let component: PlanUpgradeHelpComponent;
  let fixture: ComponentFixture<PlanUpgradeHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanUpgradeHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanUpgradeHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
