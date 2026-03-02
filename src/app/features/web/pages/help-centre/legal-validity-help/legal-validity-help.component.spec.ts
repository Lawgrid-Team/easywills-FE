import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalValidityHelpComponent } from './legal-validity-help.component';

describe('LegalValidityHelpComponent', () => {
  let component: LegalValidityHelpComponent;
  let fixture: ComponentFixture<LegalValidityHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalValidityHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalValidityHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
