import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  email = '';
  senha = '';

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  voltar() {
    this.router.navigate(['/']);
  }

  irCadastro() {
    this.router.navigate(['/cadastro']);
  }

  falarInstrucao() {
    const msg = new SpeechSynthesisUtterance(
      'Se você não for um professor, aperta na seta'
    );
    window.speechSynthesis.speak(msg);
  }
  async login() {
    try {
      const resposta = await this.auth.login(this.email, this.senha);

      this.auth.salvarSessao(resposta.nome, resposta.token);

      this.router.navigate(['/dashboard']);
    } catch (e) {
      alert('Email ou senha inválidos');
    }
  }
}
