import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface QuickAction {
    text: string;
    icon: string;
}

@Component({
    selector: 'app-quick-actions-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './quick-actions-widget.component.html',
    styleUrls: ['./quick-actions-widget.component.scss'],
})
export class QuickActionsWidgetComponent {
    actions: QuickAction[] = [
        { text: 'Create new Will', icon: '/svg/icon-create-will.svg' },
        { text: 'Add/Edit Assets', icon: '/svg/icon-edit-assets.svg' },
        {
            text: 'Manage Beneficiaries',
            icon: '/svg/icon-manage-beneficiaries.svg',
        },
        { text: 'Preview A4 Will', icon: '/svg/icon-preview-will.svg' },
        { text: 'Sign and validate will', icon: '/svg/icon-sign-will.svg' }, 
    ];

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}
}
