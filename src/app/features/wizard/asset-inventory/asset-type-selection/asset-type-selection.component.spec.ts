import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTypeSelectionComponent } from './asset-type-selection.component';

describe('AssetTypeSelectionComponent', () => {
  let component: AssetTypeSelectionComponent;
  let fixture: ComponentFixture<AssetTypeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetTypeSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetTypeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
