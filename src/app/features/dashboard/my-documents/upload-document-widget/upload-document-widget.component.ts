import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-upload-document-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './upload-document-widget.component.html',
    styleUrls: ['./upload-document-widget.component.scss'],
})
export class UploadDocumentWidgetComponent {
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            // Handle file upload logic here
            console.log('Files selected:', input.files);
        }
    }

    onBrowseClick(fileInput: HTMLInputElement): void {
        fileInput.click();
    }
}
