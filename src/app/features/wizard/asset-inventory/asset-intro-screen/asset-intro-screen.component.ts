import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-asset-intro-screen',
  imports: [],
  templateUrl: './asset-intro-screen.component.html',
  styleUrl: './asset-intro-screen.component.scss'
})
export class AssetIntroScreenComponent {

    @Output() next = new EventEmitter<void>()

    onNext(): void {
      this.next.emit()
    }

}
