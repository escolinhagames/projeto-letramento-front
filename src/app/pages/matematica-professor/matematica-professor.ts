import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatematicaService } from '../../services/matematica.service';

@Component({
  selector: 'app-matematica-professor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './matematica-professor.html',
  styleUrls: ['./matematica-professor.scss']
})
export class MatematicaProfessorComponent implements OnInit {
  dificuldade = 'FACIL';
  maxAcertos = 5;
  maxErros = 3;
  salas: any[] = [];
  carregando = true;
  mensagem = '';
  mensagemTipo = '';

  constructor(
    private service: MatematicaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.carregarSalas(); }

  carregarSalas() {
    const professorId = Number(localStorage.getItem('professorId') || 0);
    this.service.listarMinhasSalas(professorId).subscribe({
      next: (data) => { this.salas = data; this.carregando = false; this.cdr.detectChanges(); },
      error: () => { this.carregando = false; }
    });
  }


  criar() {
    const professorId = Number(localStorage.getItem('professorId') || 0);
    this.service.criarSala(this.dificuldade, professorId,
                            this.maxAcertos, this.maxErros).subscribe({
      next: () => {
        this.mostrarMensagem('Sala criada com sucesso!', 'success');
        this.carregarSalas();
      },
      error: () => this.mostrarMensagem('Erro ao criar sala', 'error')
    });
  }

  desativar(id: number) {
    if (!confirm('Desativar esta sala?')) return;
    this.service.desativarSala(id).subscribe({
      next: () => { this.mostrarMensagem('Sala desativada!', 'success'); this.carregarSalas(); },
      error: () => this.mostrarMensagem('Erro ao desativar', 'error')
    });
  }

  nomeDificuldade(d: string): string {
    return d === 'FACIL' ? 'Fácil' : d === 'MEDIO' ? 'Médio' : 'Difícil';
  }

  mostrarMensagem(msg: string, tipo: string) {
    this.mensagem = msg; this.mensagemTipo = tipo;
    setTimeout(() => this.mensagem = '', 4000);
  }

  voltar() { this.router.navigate(['/dashboard']); }
}
