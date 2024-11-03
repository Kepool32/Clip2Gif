import { Component } from '@angular/core';
import { ConversionService } from '../../services/conversion.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  selectedFile: File | null = null;
  videoUrl: string | null = null;
  loading: boolean = false;
  countdown: number = 10;
  gifUrl: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  validationMessage: string | null = null;

  constructor(private conversionService: ConversionService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.gifUrl = null;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.resetSuccessMessage();

      if (this.isValidFileType(file) && this.isValidFileSize(file)) {
        this.selectedFile = file;
        this.videoUrl = URL.createObjectURL(this.selectedFile);
        this.validationMessage = null;

      } else {
        this.resetFile();
        if (!this.isValidFileType(file)) {
          this.validationMessage =
            'Неверный тип файла. Пожалуйста, выберите видео файл.';
        } else if (!this.isValidFileSize(file)) {
          this.validationMessage =
            'Файл слишком большой. Максимальный размер: 768 КБ.';
        }
      }
    }
  }

  startConversion() {
    if (this.selectedFile) {
      this.loading = true;
      this.countdown = 10;
      const countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(countdownInterval);
          this.convertFile();
        }
      }, 1000);
    }
  }

  async convertFile() {
    try {
      const gifBlob = await this.conversionService.convertVideo(
        this.selectedFile!
      );
      this.gifUrl = URL.createObjectURL(gifBlob);
      this.successMessage = 'Конвертация прошла успешно!';
      this.errorMessage = null;
      this.resetFile();
    } catch (error) {
      this.errorMessage = 'Ошибка во время конвертации: ' + error;
      this.successMessage = null;
    } finally {
      this.loading = false;
    }
  }

  private resetSuccessMessage() {
    this.successMessage = null;
    this.errorMessage = null;
  }

  private resetFile() {
    this.selectedFile = null;
    this.videoUrl = null;
  }

  private isValidFileType(file: File): boolean {
    return file.type.startsWith('video/');
  }

  private isValidFileSize(file: File): boolean {
    return file.size <= 1024 * 768;
  }
}
