import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSecurityHelpComponent } from './data-security-help.component';

describe('DataSecurityHelpComponent', () => {
  let component: DataSecurityHelpComponent;
  let fixture: ComponentFixture<DataSecurityHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSecurityHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSecurityHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
