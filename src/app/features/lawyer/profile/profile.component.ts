import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AccountService} from '../../../core/services/Wizard/account.service';
import {LawyerService} from '../../../core/services/lawyer.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
    user = {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@lawfirm.com',
        phone: '+1 (555) 987-6543',
        initials: 'SJ',
        lawFirm: 'Johnson & Associates',
        barNumber: 'CA-123456',
        specialization: 'Estate Planning',
    };

    preferences = {
        email: true,
        sms: false,
        inApp: true,
        push: false,
        emailNotifications: true,
    };

    constructor(private accountService: AccountService,
                private lawyerService: LawyerService
    ) {
    }

    ngOnInit(): void {
        this.accountService.getUserProfile();

        this.accountService.userData$.subscribe({
            next: (value) => {
                this.user = { ...this.user, ...value };
            },
        });

        this.lawyerService.getMyFirmInfo().subscribe({
            next: (data: any) => {
                console.log(data);
                this.user.lawFirm = data.organizationName

            }
        })
    }
}
