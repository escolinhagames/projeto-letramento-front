import { Component } from '@angular/core';
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
export class IndexComponent {

  constructor(private router: Router) {}

  irLogin() {
    localStorage.setItem('tipoUsuario', 'professor');
    this.router.navigate(['/login']);
  }

  irAluno() {
    localStorage.setItem('tipoUsuario', 'aluno');
    this.router.navigate(['/dashboard']);
  }

  falarInstrucao() {
    const msg = new SpeechSynthesisUtterance(
      'Se você for um aluno clique no botão que tem um aluno'
    );
    window.speechSynthesis.speak(msg);
  }
}

