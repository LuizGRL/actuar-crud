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
    this.alunoService.alunos$.subscribe((data: Aluno[]) => {
      this.alunos = data;
    });

    const storedAlunos = this.alunoService.carregarTodosOsAlunos();
    if (storedAlunos.length > 0 && storedAlunos[0] != null) {
      this.alunos = storedAlunos;
    } else {
      this.alunoService.getAlunos().subscribe((data: Aluno[]) => {
        this.alunos = data;
        this.alunoService.salvarAlunosApiNoLocalStorage(this.alunos);
      });
    }
  }

}
