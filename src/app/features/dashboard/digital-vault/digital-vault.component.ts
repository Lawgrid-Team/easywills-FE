import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardsComponent } from './widgets/stat-cards/stat-cards.component';
import { ActivityLogComponent } from './widgets/activity-log/activity-log.component';

@Component({
    selector: 'app-digital-vault',
    standalone: true,
    imports: [CommonModule, StatCardsComponent, ActivityLogComponent],
    templateUrl: './digital-vault.component.html',
    styleUrls: ['./digital-vault.component.scss'],
})
export class DigitalVaultComponent {}
