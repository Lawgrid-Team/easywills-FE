import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface CodicilAction {
    text: string;
    icon: string;
    link: string;
    fragment?: string;
}

@Component({
    selector: 'app-create-codicils-widget',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './create-codicils-widget.component.html',
    styleUrls: ['./create-codicils-widget.component.scss'],
})
export class CreateCodicilsWidgetComponent {
    codicilActions: CodicilAction[] = [
        {
            text: 'Personal information',
            icon: '/svg/icon-edit-user.svg',
            link: '/create-codicil',
            fragment: 'personal-details',
        },
        {
            text: 'Beneficiaries',
            icon: '/svg/icon-users.svg',
            link: '/create-codicil',
            fragment: 'personal-details',
        },
        {
            text: 'Estate Distribution',
            icon: '/svg/icon-home.svg',
            link: '/create-codicil',
            fragment: 'distribution',
        },
        {
            text: 'Executors & Witnesses',
            icon: '/svg/icon-list-doc.svg',
            link: '/create-codicil',
            fragment: 'executor',
        },
    ];

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}
}
