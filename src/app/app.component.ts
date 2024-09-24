import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlunoService } from './core/service/aluno.service';
import { Aluno } from './core/entity/aluno.model';
import { CommonModule } from '@angular/common';
import { AlunosTableComponent } from "./alunos/components/alunos-table/alunos-table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AlunosTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'actuar-crud';
  alunos: Aluno[] = [];

  constructor(private alunoService: AlunoService) {}

  ngAfterViewInit() {
    // Verifica se há alunos já carregados no BehaviorSubject
    this.alunoService.alunos$.subscribe((data: Aluno[]) => {
      if (data.length > 0) {
        this.alunos = data;
        console.log(data)

      }
    });

    // Carrega os alunos do localStorage
    const storedAlunos = this.alunoService.carregarTodosOsAlunos();
    console.log(storedAlunos)

    if (storedAlunos.length > 0) {
      // Caso tenha alunos no localStorage, atualiza o BehaviorSubject
      this.alunoService.atualizarAlunos();
    } else {
      // Caso não tenha alunos, carrega da API e salva no localStorage
      this.alunoService.getAlunos().subscribe((data: Aluno[]) => {
        this.alunos = data;
        this.alunoService.salvarAlunosApiNoLocalStorage(this.alunos);
        this.alunoService.atualizarAlunos(); // Atualiza o BehaviorSubject com os dados da API
      });
    }
  }
}
