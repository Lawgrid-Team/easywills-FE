import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyInfoComponent } from './verify-info.component';

describe('VerifyInfoComponent', () => {
  let component: VerifyInfoComponent;
  let fixture: ComponentFixture<VerifyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
