import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ConversionService {
  private apiUrl = `${environment.apiBaseUrl}convert`;

  async convertVideo(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await axios.post(this.apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      console.log('Файл успешно отправлен и получен ответ');
      return response.data;
    } catch (error) {
      console.error('Ошибка при конвертации видео:', error);
      throw new Error('Ошибка при конвертации видео. Попробуйте снова.');
    }
  }

  isValidFileType(file: File): boolean {
    return file.type.startsWith('video/');
  }

  isValidFileSize(file: File): boolean {
    return file.size <= 1024 * 768; // 768 KB
  }

  isValidFileDuration(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        const isDurationValid = video.duration <= 10; // 10 seconds
        URL.revokeObjectURL(video.src);
        resolve(isDurationValid);
      };
    });
  }
}
