import { Component } from '@angular/core';
import { ConversionService } from '../../services/conversion.service';
import {Messages} from "../../constans/constans";
import {ValidationComponent} from "../validation/validation.component";
import {LoaderComponent} from "../loader/loader.component";
import {GifResultComponent} from "../gif-result/gif-result.component";


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  imports: [
    ValidationComponent,
    LoaderComponent,
    GifResultComponent
  ],
  standalone: true

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
      console.log('Файл выбран:', file); // Отладочный лог
      this.resetMessages();

      if (this.conversionService.isValidFileType(file) && this.conversionService.isValidFileSize(file)) {
        const isDurationValid = await this.conversionService.isValidFileDuration(file);
        console.log('Длительность видео допустима:', isDurationValid); // Отладочный лог
        if (isDurationValid) {
          this.selectedFile = file;
          this.videoUrl = URL.createObjectURL(file);
          console.log('videoUrl установлен:', this.videoUrl);
          this.validationMessage = null;
        } else {
          this.resetFile();
          this.validationMessage = Messages.VIDEO_DURATION_ERROR; // Используем константу
        }
      } else {
        this.resetFile();
        this.validationMessage = !this.conversionService.isValidFileType(file)
            ? Messages.FILE_TYPE_ERROR // Используем константу
            : Messages.FILE_SIZE_ERROR; // Используем константу
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

  convertFile() {
    if (this.selectedFile) {
      this.loading = true; // Начинаем индикатор загрузки

      this.conversionService.convertVideo(this.selectedFile).subscribe({
        next: (gifBlob) => {
          this.gifUrl = URL.createObjectURL(gifBlob); // Здесь gifBlob - это Blob
          this.successMessage = Messages.CONVERSION_SUCCESS; // Используем константу
          this.errorMessage = null;
          this.videoUrl = null; // Удаляем видео и показываем GIF
          this.resetFile();
        },
        error: (error) => {
          this.errorMessage = Messages.CONVERSION_ERROR + error.message; // Используем константу
          this.successMessage = null;
        },
        complete: () => {
          this.loading = false; // Завершаем загрузку
        }
      });
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
}
