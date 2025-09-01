import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Router, RouterModule} from '@angular/router';
import {WillDataService} from '../../../../core/services/Wizard/will-data.service';
import {AccountService} from '../../../../core/services/Wizard/account.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
    @Input() showSaveExitButton = true; // Default to showing the button
    @Input() showUserProfileSection = false;
    userName = 'John Doe';
    userEmail = 'johndoe@gmail.com';
    userAvatarUrl = '/svg/display-pic.svg';
    verified = false;

    constructor(
        private router: Router,
        private willDataService: WillDataService,
        private accountService: AccountService,
    ) {}

    ngOnInit(): void {
        if (this.showSaveExitButton === true) {
            this.showUserProfileSection = false;
        }
        this.accountService.getUserProfile();

        this.accountService.userData$.subscribe({
            next: (value) => {
                if (value) {
                    this.userName = value.name;
                    this.userEmail = value.email;
                    if (value.avatar) {
                        this.userAvatarUrl = value.avatar
                    }
                    this.verified = value.identityVerified
                }
            }
        })
    }

    onSaveAndExit(): void {
        this.willDataService.saveWillData();
        this.router.navigate(['/wiz']);
    }
}
