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
    isDraggingOver = false;

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDraggingOver = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDraggingOver = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDraggingOver = false;
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.handleFiles(files);
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.handleFiles(input.files);
        }
    }

    handleFiles(files: FileList): void {
        // Handle file upload logic here
        console.log('Files selected:', files);
    }

    onBrowseClick(fileInput: HTMLInputElement): void {
        fileInput.click();
    }
}
