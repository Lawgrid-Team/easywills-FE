import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CodicilAction {
    text: string;
    icon: string;
    link: string;
}

@Component({
    selector: 'app-create-codicils-widget',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './create-codicils-widget.component.html',
    styleUrls: ['./create-codicils-widget.component.scss'],
})
export class CreateCodicilsWidgetComponent {
    codicilActions: CodicilAction[] = [
        {
            text: 'Personal information',
            icon: '/svg/icon-edit-user.svg',
            link: '#',
        },
        { text: 'Beneficiaries', icon: '/svg/icon-users.svg', link: '#' },
        { text: 'Estate Distribution', icon: '/svg/icon-home.svg', link: '#' },
        {
            text: 'Executors & Witnesses',
            icon: '/svg/icon-list-doc.svg',
            link: '#',
        },
    ];

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}
}
