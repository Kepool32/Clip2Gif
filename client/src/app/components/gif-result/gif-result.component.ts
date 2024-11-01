import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-gif-result',
  templateUrl: './gif-result.component.html',
  styleUrls: ['./gif-result.component.css'],
})
export class GifResultComponent implements OnChanges {
  @Input() gifUrl: string | ArrayBuffer | null = null;
  @Input() successMessage: string | null = null;
  @Input() errorMessage: string | null = null;

  private showSuccessMessage: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    // Если сообщение об успехе изменилось и не равно null
    if (changes['successMessage'] && this.successMessage) {
      this.showSuccessMessage = true;
      // Устанавливаем таймер на 3 секунды (3000 миллисекунд)
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    }
  }

  isSuccessMessageVisible(): boolean {
    return this.showSuccessMessage;
  }
}
