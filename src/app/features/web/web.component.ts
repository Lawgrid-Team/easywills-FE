import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './widgets/header/header.component';
import { FooterComponent } from './widgets/footer/footer.component';

@Component({
  selector: 'app-web',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './web.component.html',
  styleUrl: './web.component.scss'
})
export class WebComponent {

}
