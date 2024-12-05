import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  standalone: true,
})
export class LoaderComponent implements OnInit {
  @Input() countdown: number = 1;
  @Input() loading: boolean;

  ngOnInit() {
    const countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);
  }
}
