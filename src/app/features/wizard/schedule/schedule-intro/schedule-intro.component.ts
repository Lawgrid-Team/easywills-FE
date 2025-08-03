import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-schedule-intro',
  imports: [],
  templateUrl: './schedule-intro.component.html',
  styleUrl: './schedule-intro.component.scss'
})
export class ScheduleIntroComponent {
  isFormValid = true;
  
  @Output() next = new EventEmitter<void>()
  
    onNext(): void {
      this.next.emit()
    }
}
