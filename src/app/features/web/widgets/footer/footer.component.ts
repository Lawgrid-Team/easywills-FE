import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
})
export class FooterComponent {
    email: string = '';

    onSubscribe(): void {
        // Implement subscription logic here
        console.log('Subscribing with email:', this.email);
    }
}
