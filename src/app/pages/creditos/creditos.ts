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
    'Lucas Samuel Gomes Freire Barbosa',
    'Carlos Eduardo Dias Jesus',
    'Vinicius Henrique Ferraroni Novais',
    'Kayke Alves Cavalcanti',
    'Kelvin da Silva Reis',
    'Leonardo das Chagas',
    'Matheus Pereira Feitoza da Silva',
    'Nadia Isabel Barahona Canhete',
    'Professor: João Roberto Ursino da Cruz'

  ];

  voltar() {
    window.history.back();
  }
}
