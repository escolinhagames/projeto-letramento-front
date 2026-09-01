import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './index.html',
  styleUrls: ['./index.scss']
})
export class IndexComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.falarInstrucao();
    }, 1000);

    const falarAoTocar = () => {
      this.falarInstrucao();
      document.removeEventListener('touchstart', falarAoTocar);
      document.removeEventListener('click', falarAoTocar);
    };

    document.addEventListener('touchstart', falarAoTocar, { once: true });
    document.addEventListener('click', falarAoTocar, { once: true });
  }

  irLogin() {
    localStorage.setItem('tipoUsuario', 'professor');
    this.router.navigate(['/login']);
  }

  irAluno() {
    this.router.navigate(['/aluno-dashboard']);
  }

  falarInstrucao() {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(
      'Se você for um aluno, clique na imagem do aluno. '
    );
    msg.lang = 'pt-BR';
    msg.rate = 1.5;
    msg.pitch = 1.1;
    window.speechSynthesis.speak(msg);
  }
}
