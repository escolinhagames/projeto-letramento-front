import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.scss']
})
export class CadastroComponent {

  nome = '';
  email = '';
  senha = '';
  confirmar = '';
  erro = '';

 constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  async salvar() {
    if (this.senha !== this.confirmar) {
      this.erro = 'Senhas não conferem';
      return;
    }

    try {
      const resposta = await this.auth.register(
        this.nome,
        this.email,
        this.senha
      );

      this.auth.salvarSessao(resposta.nome, resposta.token);

      this.router.navigate(['/dashboard']);
    } catch (e) {
      this.erro = 'Erro ao cadastrar';
    }
  }
}
