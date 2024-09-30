import { Injectable } from "@angular/core";
import { Aluno } from "../../entity/aluno.model";
import { HttpClient } from "@angular/common/http";
import { HttpClientModule } from '@angular/common/http';
import { elementAt, Observable, map ,tap , of, BehaviorSubject } from "rxjs";


@Injectable({providedIn:'root'}) //para ficar visivel em tood o projeto
export class AlunoService{
  private apiUrl = 'https://6467a872e99f0ba0a814b5ff.mockapi.io/api/Pessoas';
   private alunosSubject = new BehaviorSubject<Aluno[]>(this.carregarTodosOsAlunos());
  public alunos$ = this.alunosSubject.asObservable();

  constructor(private http: HttpClient){} //para injetar o procolo HTTP

  getAlunos(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.apiUrl).pipe(
      map((response: Aluno[]) => {
        const apiAlunos = response.map(aluno =>
          new Aluno(aluno.Nome, aluno.Sexo, aluno.Email, new Date(aluno.DataNascimento))
        );
        const localAlunos = this.carregarTodosOsAlunos();
        return [...apiAlunos, ...localAlunos];
      })
    );
  }

  salvarAlunosApiNoLocalStorage(alunos: Aluno[]): void{
    localStorage.setItem('alunos', JSON.stringify(alunos));
  }

  carregarTodosOsAlunos(): Aluno[]{
    const alunos = localStorage.getItem('alunos');
    return alunos ? JSON.parse(alunos).map((aluno:any)=>
      new Aluno(aluno.Nome, aluno.Sexo, aluno.Email, new Date(aluno.DataNascimento))) : [];
  }

  buscarAlunoPorEmail(email: string): Aluno | null{
    const alunos = this.carregarTodosOsAlunos();
    const aluno = alunos.find(elemento=> elemento.Email.toLowerCase() == email.toLowerCase());
    return aluno || null;
  }

  atualizarAlunos() {
    const alunos = this.carregarTodosOsAlunos();
    this.alunosSubject.next(alunos);
  }


  criarAluno(aluno: Aluno): Observable<string> {
    return new Observable(observer => {
      if (aluno.Nome.length <= 0 || aluno.Sexo.length <= 0 || aluno.Email.length <= 0 || aluno.DataNascimento == null) {
        observer.error("nenhum campo pode ser nulo");
        observer.complete();
        return;
      }

      const alunos = this.carregarTodosOsAlunos();

      if (alunos.length > 0) {
        if (!this.validarEmailLivre(aluno.Email)) {
          observer.error("Erro, Email já foi cadastrado no sistema");
          observer.complete();
          return;
        }
      }

      alunos.push(aluno);
      localStorage.setItem('alunos', JSON.stringify(alunos));
      observer.next("Elemento inserido com Sucesso");
      observer.complete();
    });
  }

  removerAluno(aluno: Aluno): Observable<string> {
    return new Observable(observer => {
      const alunos = this.carregarTodosOsAlunos();

      if (alunos.length < 1) {
        observer.error("Não existem elementos para serem excluídos");
        observer.complete();
        return;
      }

      const indexAluno = alunos.findIndex(elemento => elemento.Email.toLowerCase() === aluno.Email.toLowerCase());

      if (indexAluno === -1) {
        observer.error("Aluno não encontrado");
        observer.complete();
        return;
      }

      alunos.splice(indexAluno, 1);

      localStorage.setItem('alunos', JSON.stringify(alunos));

      this.alunosSubject.next(alunos);

      observer.next("Removido com sucesso");
      observer.complete();
    });
  }

  editarAluno(alunoInstanciaAntiga: Aluno, alunoNovaInstancia: Aluno): Observable<string> {
    return new Observable(observer => {
      const alunos = this.carregarTodosOsAlunos();

      if (!this.validarEmailLivre(alunoNovaInstancia.Email) &&
          alunoNovaInstancia.Email.toLowerCase() !== alunoInstanciaAntiga.Email.toLowerCase()) {
        observer.error("Novo Email já está sendo usado por uma outra conta");
        observer.complete();
        return;
      }

      const alunoIndex = alunos.findIndex(
        elemento => elemento.Email.toLowerCase() === alunoInstanciaAntiga.Email.toLowerCase()
      );

      if (alunoIndex !== -1) {
        alunos[alunoIndex] = alunoNovaInstancia;
        localStorage.setItem('alunos', JSON.stringify(alunos));

        this.alunosSubject.next(alunos);

        observer.next("Aluno editado com sucesso");
        observer.complete();
      } else {
        observer.error("Aluno não encontrado");
        observer.complete();
      }
    });
  }

  validarEmailLivre(Email:string) : boolean{
    const alunos = this.carregarTodosOsAlunos();
    const retorno = alunos.findIndex(elemento => elemento.Email.toLowerCase() == Email.toLowerCase());
    if(retorno!==-1){
      return false
    }
    return true
  }


}
