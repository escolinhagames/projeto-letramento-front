import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-instrucoes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instrucoes.html',
  styleUrls: ['./instrucoes.scss']
})
export class InstrucoesComponent {

  videos: {
    titulo: string;
    url: SafeResourceUrl;
  }[] = [];

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.videos = [
      {
        titulo: 'Como usar ',
        url: this.sanitizer.bypassSecurityTrustResourceUrl(
          'https://www.youtube.com/embed/E4rk1q_4l-s?si=fGBH9eEkBY2CahjW'
        )
      }
    ];
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }
}
