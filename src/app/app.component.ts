import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlunoService } from './core/service/aluno.service';
import { Aluno } from './core/entity/aluno.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit{
  alunos: Aluno[] = [];

  constructor(private alunoService: AlunoService) {} //injetando depedencia

  ngAfterViewInit(){
    const storedAlunos = this.alunoService.loadAlunoInLocal();
    if (storedAlunos.length > 0  && storedAlunos[0] != null) {
      this.alunos = storedAlunos;

    } else {
      console.log('teste'+this.alunos)
      this.alunoService.getAlunos().subscribe((data) => {
        this.alunos = data;
        this.alunoService.saveAlunosApiInLocal(this.alunos);
      });
    }
  }
}
