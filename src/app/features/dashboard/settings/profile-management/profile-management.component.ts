import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AccountService} from '../../../../core/services/Wizard/account.service';

@Component({
    selector: 'app-profile-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './profile-management.component.html',
    styleUrls: ['./profile-management.component.scss'],
})
export class ProfileManagementComponent {

    user = {
        name: 'John 4Doe',
        email: 'johndoe@gmail.com',
        phone: '+1 (555) 123-4567',
        initials: 'JD',
    };

    preferences = {
        email: true,
        sms: false,
        inApp: true,
        push: false,
        emailNotifications: true,
    };

    constructor(
        private accountService: AccountService
    ) {
    }

    ngOnInit(): void {
        this.accountService.getUserProfile();

        this.accountService.userData$.subscribe({
            next: (value) => {
                this.user = value
            }
        })
    }

}
