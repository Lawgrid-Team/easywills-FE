import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Document {
    id: number;
    date: string;
    time: string;
    name: string;
    type: 'pdf' | 'doc';
}

@Component({
    selector: 'app-documents-list-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './documents-list-widget.component.html',
    styleUrls: ['./documents-list-widget.component.scss'],
})
export class DocumentsListWidgetComponent {
    @Input() documents: Document[] = [];

    onViewDocument(document: Document): void {
        // TODO: Implement document view functionality
        console.log('View document:', document.name);
    }

    onDeleteDocument(document: Document): void {
        // TODO: Implement document delete functionality
        console.log('Delete document:', document.name);
    }

    onSearch(searchTerm: string): void {
        // TODO: Implement search functionality
        console.log('Search documents:', searchTerm);
    }

    onFilterChange(filter: string): void {
        // TODO: Implement filter functionality
        console.log('Filter changed:', filter);
    }

    getIcon(type: 'pdf' | 'doc'): string {
        return type === 'pdf' ? '/svg/pdf-icon.png' : '/svg/my-documents.svg';
    }
}
