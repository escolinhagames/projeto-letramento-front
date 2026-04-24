import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  nome = '';
  modalAberto = false;

  ngOnInit() {
    this.nome = localStorage.getItem('nome') || '';
  }

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  async salvarPalavra() {
    const palavraInput = document.getElementById('palavra') as HTMLInputElement;
    const imagemInput = document.getElementById('imagem') as HTMLInputElement;
    const token = localStorage.getItem('token') || '';
    const professorId = localStorage.getItem('professorId') || '1';

  if (!palavraInput.value || imagemInput.files?.length === 0) {
    alert("Preencha tudo");
    return;
  }

  const formData = new FormData();
  formData.append("palavra", palavraInput.value);
  formData.append("imagem", imagemInput.files![0]);

  try {
      const response = await fetch(`http://localhost:8080/palavras/${professorId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (response.ok) {
      alert("Salvo com sucesso");
      this.fecharModal();
    } else {
      alert("Erro: " + response.status);
    }

  } catch (e) {
    console.error(e);
  }
}
}
