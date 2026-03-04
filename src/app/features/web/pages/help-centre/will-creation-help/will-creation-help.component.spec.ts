import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WillCreationHelpComponent } from './will-creation-help.component';

describe('WillCreationHelpComponent', () => {
  let component: WillCreationHelpComponent;
  let fixture: ComponentFixture<WillCreationHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WillCreationHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WillCreationHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
