import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-stat-cards',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './stat-cards.component.html',
    styleUrls: ['./stat-cards.component.scss'],
})
export class StatCardsComponent {
    stats = [
        {
            title: 'Total Number of Documents Stored',
            value: '50',
            chartPath: 'M0 20 L15 10 L30 15 L45 5 L60 10 L75 12 L90 20',
        },
        {
            title: 'Recent Uploads',
            value: '5',
            chartPath: 'M0 15 L15 18 L30 12 L45 15 L60 8 L75 10 L90 5',
        },
    ];
}
