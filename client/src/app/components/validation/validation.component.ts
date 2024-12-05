import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css'],
  standalone: true

})
export class ValidationComponent {
  @Input() validationMessage: string | null = null;
}
