import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourWillWidgetComponent } from './your-will-widget.component';

describe('YourWillWidgetComponent', () => {
  let component: YourWillWidgetComponent;
  let fixture: ComponentFixture<YourWillWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourWillWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourWillWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
