import { enableProdMode } from '@angular/core';
import { environment } from './src/environment/environment';
import {AppComponent} from "./src/app/app.component";
import {bootstrapApplication} from "@angular/platform-browser";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent)
    .catch(error => console.error(error));
/*
platformBrowserDynamic()
  .bootstrapAplica(AppComponent)
  .catch((err) => console.error(err));
*/
