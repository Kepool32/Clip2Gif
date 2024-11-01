import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { UploadComponent } from './components/upload/upload.component';
import { AppComponent } from './app.component';
import { ValidationComponent } from './components/validation/validation.component';
import { LoaderComponent } from './components/loader/loader.component';
import { GifResultComponent } from './components/gif-result/gif-result.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    ValidationComponent,
    LoaderComponent,
    GifResultComponent,
  ],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
