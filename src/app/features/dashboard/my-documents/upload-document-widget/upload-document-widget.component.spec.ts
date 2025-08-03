import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentWidgetComponent } from './upload-document-widget.component';

describe('UploadDocumentWidgetComponent', () => {
  let component: UploadDocumentWidgetComponent;
  let fixture: ComponentFixture<UploadDocumentWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDocumentWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDocumentWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
