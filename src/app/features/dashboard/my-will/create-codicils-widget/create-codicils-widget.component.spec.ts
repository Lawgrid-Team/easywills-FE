import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCodicilsWidgetComponent } from './create-codicils-widget.component';

describe('CreateCodicilsWidgetComponent', () => {
  let component: CreateCodicilsWidgetComponent;
  let fixture: ComponentFixture<CreateCodicilsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCodicilsWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCodicilsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
