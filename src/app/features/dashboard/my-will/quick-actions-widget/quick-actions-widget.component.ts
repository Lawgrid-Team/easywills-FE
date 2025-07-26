import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface QuickAction {
    text: string;
    icon: string;
    link: string;
}

@Component({
    selector: 'app-quick-actions-widget',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './quick-actions-widget.component.html',
    styleUrls: ['./quick-actions-widget.component.scss'],
})
export class QuickActionsWidgetComponent {
    actions: QuickAction[] = [
        {
            text: 'Create new Will',
            icon: '/svg/icon-create-will.svg',
            link: '/wiz/welcome',
        },
        {
            text: 'Add/Edit Assets',
            icon: '/svg/icon-edit-assets.svg',
            link: '/wiz/will/assets',
        },
        {
            text: 'Manage Beneficiaries',
            icon: '/svg/icon-manage-beneficiaries.svg',
            link: '/wiz/will/beneficiaries',
        },
        {
            text: 'Preview A4 Will',
            icon: '/svg/icon-preview-will.svg',
            link: '/view-will',
        },
        {
            text: 'Sign and validate will',
            icon: '/svg/icon-sign-will.svg',
            link: '/wiz/will/review-and-download',
        },
    ];

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}
}
