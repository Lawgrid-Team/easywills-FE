import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyIntroComponent } from './verify-intro.component';

describe('VerifyIntroComponent', () => {
  let component: VerifyIntroComponent;
  let fixture: ComponentFixture<VerifyIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyIntroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
