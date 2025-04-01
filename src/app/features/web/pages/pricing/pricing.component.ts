import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    imports: [CommonModule, MatIconModule],
    selector: 'app-pricing',
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent {
    expandedTier = 'free';

    constructor() {}

    ngOnInit(): void {}

    toggleTier(tier: string): void {
        this.expandedTier = this.expandedTier === tier ? '' : tier;
    }
}
