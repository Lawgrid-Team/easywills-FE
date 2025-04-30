import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetIntroScreenComponent } from './asset-intro-screen.component';

describe('AssetIntroScreenComponent', () => {
  let component: AssetIntroScreenComponent;
  let fixture: ComponentFixture<AssetIntroScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetIntroScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetIntroScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
