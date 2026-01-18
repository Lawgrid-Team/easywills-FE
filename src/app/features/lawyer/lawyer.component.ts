import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-lawyer',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './lawyer.component.html',
    styleUrl: './lawyer.component.scss',
})
export class LawyerComponent {}
