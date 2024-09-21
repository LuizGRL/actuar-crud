import { Injectable } from "@angular/core";
import { Aluno } from "../entity/aluno.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs";

@Injectable({providedIn:'root'}) //para ficar visivel em tood o projeto
export class AlunoService{
  private apiUrl = 'https://6467a872e99f0ba0a814b5ff.mockapi.io/api/Pessoas';

  constructor(private http: HttpClient){} //para injetar o procolo HTTP

  getAlunos() : Observable<Aluno[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((response: any[]) => {
        return response.map(aluno =>
          new Aluno(aluno.Nome, aluno.Sexo, aluno.Email, new Date(aluno.DataNascimento))
        );
      })
    );
  }

  saveAlunosApiInLocal(alunos: Aluno[]): void{
    localStorage.setItem('alunos', JSON.stringify(alunos));

  }

  loadAlunoInLocal(): Aluno[]{
    const alunos = localStorage.getItem('alunos');
    return alunos ? JSON.parse(alunos).map((aluno:any)=>
      new Aluno(aluno.nome, aluno.sexo, aluno.email, new Date(aluno.dataNascimento))) : [];
  }

}
