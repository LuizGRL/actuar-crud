import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlunoService } from './core/service/alunos/aluno.service';
import { Aluno } from './core/entity/aluno.model';
import { CommonModule } from '@angular/common';
import { AlunosTableComponent } from "./alunos/components/alunos-table/alunos-table.component";
import { HeaderComponent } from "./shared/components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AlunosTableComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'actuar-crud';
  alunos: Aluno[] = [];

  constructor(private alunoService: AlunoService) {}

  ngAfterViewInit() {
    this.alunoService.alunos$.subscribe((data: Aluno[]) => {
      if (data.length > 0) {
        this.alunos = data;
        console.log(data)
      }
    });

    const storedAlunos = this.alunoService.carregarTodosOsAlunos();
    console.log(storedAlunos)

    if (storedAlunos.length > 0) {
      this.alunoService.atualizarAlunos();
    } else {
      this.alunoService.getAlunos().subscribe((data: Aluno[]) => {
        this.alunos = data;
        this.alunoService.salvarAlunosApiNoLocalStorage(this.alunos);
        this.alunoService.atualizarAlunos();
      });
    }
  }
}
