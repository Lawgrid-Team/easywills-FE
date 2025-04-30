import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrenFormComponent } from './children-form.component';

describe('ChildrenFormComponent', () => {
  let component: ChildrenFormComponent;
  let fixture: ComponentFixture<ChildrenFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildrenFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildrenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
