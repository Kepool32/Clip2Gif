import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable, of } from 'rxjs';
import { catchError, delay, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConversionService {
  private apiUrl = `${environment.apiBaseUrl}convert`;

  constructor(private http: HttpClient) {}

  convertVideo(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('video', file);

    return this.http.post<{ jobId: string }>(this.apiUrl, formData, {
      headers: new HttpHeaders({
        'enctype': 'multipart/form-data',
      }),
    }).pipe(
        tap(response => {
          console.log('Файл успешно отправлен, ожидаем конвертацию...');
        }),
        switchMap(response => this.waitForGif(response.jobId)),
        catchError(error => {
          console.error('Ошибка при конвертации видео:', error);
          throw new Error('Ошибка при конвертации видео. Попробуйте снова.');
        })
    );
  }

  waitForGif(jobId: string): Observable<Blob> {
    const delayInterval = 3000;

    return new Observable<Blob>(observer => {
      const intervalId = setInterval(() => {
        this.http.get(`${this.apiUrl}/gif/${jobId}`, { responseType: 'blob' }).pipe(
            tap(() => {
              console.log('GIF готов, получен файл');
            }),
            catchError(err => {
              console.log('GIF еще не готов, повторяем запрос...');
              return of(null); // Возвращаем null при ошибке (GIF еще не готов)
            })
        ).subscribe(blob => {
          if (blob) {
            observer.next(blob); // Возвращаем готовый GIF
            observer.complete(); // Завершаем observable
            clearInterval(intervalId); // Очищаем интервал
          }
        });
      }, delayInterval);
    });
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
