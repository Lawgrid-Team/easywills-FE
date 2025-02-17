import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

    constructor() {}

    ngOnInit(): void {
        console.log('About Component');
    }

}
