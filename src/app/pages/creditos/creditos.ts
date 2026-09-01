import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-creditos',
  imports: [CommonModule],
  templateUrl: './creditos.html',
  styleUrls: ['./creditos.scss']
})
export class CreditosComponent {
  creditos = [
    'Carlos Eduardo Dias Jesus',
    'Lucas Samuel Gomes Freire Barbosa',
    'Vinicius Henrique Ferraroni Novais',
    'Matheus Pereira Feitoza da Silva',
    'Nadia Isabel Barahona Canhete'

  ];

  voltar() {
    window.history.back();
  }
}
