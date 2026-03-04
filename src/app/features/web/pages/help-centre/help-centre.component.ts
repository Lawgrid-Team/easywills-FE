 import { Component } from '@angular/core';
 import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//@Component({
 // selector: 'app-help-centre',
  //imports: [],
  //templateUrl: './help-centre.component.html',
  //styleUrl: './help-centre.component.scss'
//})
//export class HelpCentreComponent {

//}
@Component({
  selector: 'app-help-centre',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './help-centre.component.html',
  styleUrl: './help-centre.component.scss'
})
export class HelpCentreComponent {}