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

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.resetMessages();

      if (this.isValidFileType(file) && this.isValidFileSize(file)) {
        const isDurationValid = await this.isValidFileDuration(file);
        if (isDurationValid) {
          this.selectedFile = file;
          this.videoUrl = URL.createObjectURL(file);
          this.validationMessage = null;
        } else {
          this.resetFile();
          this.validationMessage =
            'Видео слишком длинное. Максимальная длительность: 10 секунд.';
        }
      } else {
        this.resetFile();
        this.validationMessage = !this.isValidFileType(file)
          ? 'Неверный тип файла. Пожалуйста, выберите видео файл.'
          : 'Файл слишком большой. Максимальный размер: 768 КБ.';
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
      this.videoUrl = null; // Удаляем видео и показываем GIF
      this.resetFile();
    } catch (error) {
      this.errorMessage = 'Ошибка во время конвертации: ' + error;
      this.successMessage = null;
    } finally {
      this.loading = false;
    }
  }

  private resetMessages() {
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
  private isValidFileDuration(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        const isDurationValid = video.duration <= 10;
        URL.revokeObjectURL(video.src);
        resolve(isDurationValid);
      };
    });
  }
}
