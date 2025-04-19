
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'easywills-FE';
    constructor(private router: Router) {}

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                const fragment = this.router.parseUrl(this.router.url).fragment;
                if (fragment) {
                    const element = document.getElementById(fragment);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                } 
            }
        });
    }
}
