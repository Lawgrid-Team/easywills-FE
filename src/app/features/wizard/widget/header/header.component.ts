import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { WillDataService } from '../../../../core/services/Wizard/will-data.service';

@Component({
    selector: 'app-header',
    imports: [RouterModule, MatButtonModule, MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    constructor(
        private router: Router,
        private willDataService: WillDataService
    ) {}

    onSaveAndExit(): void {
        this.willDataService.saveWillData();
        this.router.navigate(['/wiz']);
    }
}
