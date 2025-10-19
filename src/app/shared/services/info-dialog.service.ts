import { Injectable } from '@angular/core';
import { InfoDialogData } from '../components/info-dialog/info-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class InfoDialogService {
    constructor() {}

    getInfoForPage(pageName: string): InfoDialogData[] {
        const infoData: { [key: string]: InfoDialogData[] } = {
            beneficiaries: [
                {
                    title: 'Beneficiaries',
                    content:
                        'Lorem ipsum dolor sit amet consectetur. Quam turpis ac molestie leo morbi scelerisque. Tortor bibendum purus morbi felis. Risus eleifend quam aliquet eget quis. Ullamcorper mauris natoque sodales dapibus non magnis feugiat in tortor.',
                    imagePath: 'svg/tool-tip/other-beneficiaries.svg',
                },
                {
                    title: 'Beneficiaries - Page 2',
                    content:
                        'Viverra consectetur volutpat pellentesque venenatis euismod amet. At elementum integer pellentesque amet nunc justo ipsum at sociis. Non porttitor nunc est nulla purus sed nunc. Mauris natoque sodales dapibus non magnis feugiat in tortor bibendum.',
                    imagePath: 'svg/tool-tip/other-beneficiaries.svg',
                },
            ],
            'basic-info': [
                {
                    title: 'Basic Information',
                    content:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    imagePath: 'images/expert-2.png',
                },
            ],
            'address-info': [
                {
                    title: 'Address Information',
                    content:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    imagePath: 'images/expert-3.png',
                },
            ],
            // Add more pages as needed
        };

        return (
            infoData[pageName] || [
                {
                    title: 'Information',
                    content:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                },
            ]
        );
    }
}
