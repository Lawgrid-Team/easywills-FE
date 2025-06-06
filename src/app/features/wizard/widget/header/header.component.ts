import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { WillDataService } from '../../../../core/services/Wizard/will-data.service';

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    @Input() showSaveExitButton = true; // Default to showing the button

    constructor(
        private router: Router,
        private willDataService: WillDataService
    ) {}

    onSaveAndExit(): void {
        this.willDataService.saveWillData();
        this.router.navigate(['/wiz']);
    }
}
