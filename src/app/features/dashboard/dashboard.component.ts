import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderWidgetComponent } from './header-widget/header-widget.component';
import { SidebarComponent } from './sidebar/sidebar.component'; // Import SidebarComponent

@Component({
    selector: 'app-dashboard',
    imports: [RouterOutlet, HeaderWidgetComponent, SidebarComponent], // Add SidebarComponent here
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    standalone: true,
})
export class DashboardComponent {
    // Placeholder data to simulate user state
    isWillCompleted = false; // Set to `true` to see the "Completed" state
    currentUser = {
        name: 'John',
        email: 'johndoe@gmail.com',
        avatar: '/images/expert-1.png', // Using an existing image as a placeholder
    };
}
