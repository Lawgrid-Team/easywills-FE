import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        // this.router.navigate(['auth/login']);
        console.log('auth component');
    }

}
