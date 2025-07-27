import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleIntroComponent } from './schedule-intro.component';

describe('ScheduleIntroComponent', () => {
  let component: ScheduleIntroComponent;
  let fixture: ComponentFixture<ScheduleIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleIntroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
