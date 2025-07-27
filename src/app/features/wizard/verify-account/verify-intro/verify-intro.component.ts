import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-verify-intro',
  imports: [],
  templateUrl: './verify-intro.component.html',
  styleUrl: './verify-intro.component.scss'
})
export class VerifyIntroComponent {
@Output() next = new EventEmitter<void>();
  @Output() setFormValidity = new EventEmitter<boolean>();

  ngOnInit() {
    this.setFormValidity.emit(true); // Ensure boolean is emitted
  }

  onProceed() {
    this.next.emit();
  }

}


