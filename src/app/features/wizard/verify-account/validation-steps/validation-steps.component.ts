import { Component, EventEmitter, Output  } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-validation-steps',
  imports: [MatButtonModule],
  templateUrl: './validation-steps.component.html',
  styleUrl: './validation-steps.component.scss',
   standalone: true
})
export class ValidationStepsComponent {
  @Output() next = new EventEmitter<void>();
  @Output() setFormValidity = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.setFormValidity.emit(true); // Enable the Next button immediately
  }

  onGetStarted() {
    this.next.emit();
  }

}
