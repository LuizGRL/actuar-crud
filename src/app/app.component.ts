import { AfterViewInit, Component, OnInit } from '@angular/core';
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
export class AppComponent implements AfterViewInit{
  title = 'actuar-crud';

  alunos: Aluno[] = [];

  constructor(private alunoService: AlunoService) {}

  ngAfterViewInit(){
    const storedAlunos = this.alunoService.carregarTodosOsAlunos();
    if (storedAlunos.length > 0  && storedAlunos[0] != null) {
      this.alunos = storedAlunos;

    } else {
      console.log('teste'+this.alunos)
      this.alunoService.getAlunos().subscribe((data) => {
        this.alunos = data;
        this.alunoService.salvarAlunosApiNoLocalStorage(this.alunos);
      });
    }
  }
}
