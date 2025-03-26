import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './widget/header/header.component';

@Component({
  selector: 'app-wizard',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.scss'
})
export class WizardComponent {

}
