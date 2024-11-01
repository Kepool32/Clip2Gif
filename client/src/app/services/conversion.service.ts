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
}
