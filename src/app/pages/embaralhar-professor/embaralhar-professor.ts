import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmbaralharService } from '../../services/embaralhar.service';

@Component({
  selector: 'app-embaralhar-professor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './embaralhar-professor.html',
  styleUrls: ['./embaralhar-professor.scss']
})
export class EmbaralharProfessorComponent implements OnInit {
  jogos: any[] = [];
  carregando = true;
  palavra = '';
  dificuldade = 'EASY';
  imagemSelecionada: File | null = null;
  mensagem = '';
  mensagemTipo = '';

  constructor(
    private embaralharService: EmbaralharService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.carregarJogos(); }

  carregarJogos() {
    this.carregando = true;
    this.embaralharService.listarJogosProfessor().subscribe({
      next: (data) => {
        this.jogos = data;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarMensagem('Erro ao carregar jogos', 'error');
        this.carregando = false;
      }
    });
  }

  onImagemSelecionada(event: any) {
    this.imagemSelecionada = event.target.files[0];
  }

  criarJogo() {
    if (!this.palavra.trim()) { this.mostrarMensagem('Digite uma palavra', 'error'); return; }
    if (!this.imagemSelecionada) { this.mostrarMensagem('Selecione uma imagem', 'error'); return; }

    this.embaralharService.criarJogo(this.palavra, this.imagemSelecionada, this.dificuldade).subscribe({
      next: () => {
        this.mostrarMensagem('Jogo criado com sucesso!', 'success');
        this.palavra = '';
        this.imagemSelecionada = null;
        this.carregarJogos();
      },
      error: () => this.mostrarMensagem('Erro ao criar jogo', 'error')
    });
  }

  // ✅ CORRIGIDO: deletar permanente
  deletar(id: number) {
    if (!confirm('Deseja deletar este jogo permanentemente?')) return;
    this.embaralharService.deletarJogo(id).subscribe({
      next: () => {
        this.mostrarMensagem('Jogo deletado!', 'success');
        this.carregarJogos();
      },
      error: () => this.mostrarMensagem('Erro ao deletar', 'error')
    });
  }

  verDetalhes(id: number) {
    this.router.navigate(['/embaralhar/professor/detalhes', id]);
  }

  mostrarMensagem(msg: string, tipo: string) {
    this.mensagem = msg; this.mensagemTipo = tipo;
    setTimeout(() => this.mensagem = '', 4000);
  }

  voltar() { this.router.navigate(['/dashboard']); }
}
