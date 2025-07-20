import { Component, Input, Output, EventEmitter } from '@angular/core';
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
    @Output() viewAllClicked = new EventEmitter<void>();

    isFilterDropdownOpen = false;
    selectedFilter = 'All';
    filterOptions = [
        'All',
        'Wills & Trusts',
        'Power of Attorney',
        'Insurance & Finance',
        'Personal IDs',
    ];

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

    toggleFilterDropdown(): void {
        this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
    }

    onFilterChange(filter: string): void {
        this.selectedFilter = filter;
        this.isFilterDropdownOpen = false;
        // TODO: Implement filter functionality
        console.log('Filter changed:', filter);
    }

    onViewAll(): void {
        this.viewAllClicked.emit();
    }

    getIcon(type: 'pdf' | 'doc'): string {
        return type === 'pdf' ? '/svg/pdf-icon.png' : '/svg/my-documents.svg';
    }
}
