import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-intro-screen',
  imports: [],
  templateUrl: './intro-screen.component.html',
  styleUrl: './intro-screen.component.scss'
})
export class IntroScreenComponent {

isFormValid = true;

@Output() next = new EventEmitter<void>()

  onNext(): void {
    this.next.emit()
  }

}
