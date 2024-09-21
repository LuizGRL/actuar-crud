import { Injectable } from "@angular/core";
import { Aluno } from "../entity/aluno.model";
import { HttpClient } from "@angular/common/http";
import { elementAt, Observable } from "rxjs";
import { map } from "rxjs";

@Injectable({providedIn:'root'}) //para ficar visivel em tood o projeto
export class AlunoService{
  private apiUrl = 'https://6467a872e99f0ba0a814b5ff.mockapi.io/api/Pessoas';

  constructor(private http: HttpClient){} //para injetar o procolo HTTP

  getAlunos(): Observable<Aluno[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((response: any[]) => {
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
      new Aluno(aluno.nome, aluno.sexo, aluno.email, new Date(aluno.dataNascimento))) : [];
  }

  buscarAlunoPorEmail(email: string): Aluno | null{
    const alunos = this.carregarTodosOsAlunos();
    const aluno = alunos.find(elemento=> elemento.email.toLowerCase() == email.toLowerCase());
    return aluno || null;
  }

  criarAluno(aluno: Aluno): string {
    if(aluno.nome.length <= 0 || aluno.sexo.length <= 0||aluno.email.length <= 0||aluno.dataNascimento == null){
      return "nenhum campo pode ser nulo"
    }
    const alunos = this.carregarTodosOsAlunos();

    if(alunos.length>0){
      if(this.validarEmailLivre(aluno.email)==false){
        return "Erro, Email já foi cadastrado no sistema"
      }
    }

    alunos.push(aluno)
    localStorage.setItem('alunos',JSON.stringify(alunos))
    return "Elemento inserido com Sucesso"
  }

  removerAluno(aluno: Aluno) : string{
    const alunos = this.carregarTodosOsAlunos();

    if(AlunoService.length<1){
      return "Não existem elementos para serem excluidos";
    }

    const indexAluno = alunos.findIndex(elemento => elemento.email.toLowerCase() == aluno.email.toLowerCase())

    if(indexAluno==null){
      return "Aluno não econtrado";
    }

    alunos.splice(indexAluno,1);
    localStorage.setItem('alunos', JSON.stringify(alunos));
    return "Removido com sucesso";
  }

  editarAluno(alunoInstanciaAntiga : Aluno, alunoNovaInstancia: Aluno) : String{
    const alunos = this.carregarTodosOsAlunos();

    if(this.validarEmailLivre(alunoNovaInstancia.email)==false){
      return "Novo email já esta sendo usado por uma outra conta"
    }

    const alunoIndex = alunos.findIndex(
      elemento => elemento.email.toLowerCase() == alunoInstanciaAntiga.email.toLowerCase());

    if(alunoIndex!==-1){
      alunos[alunoIndex] = alunoNovaInstancia;
      localStorage.setItem('alunos',JSON.stringify(alunos));
      return "Aluno editado com sucesso";
    }else{
      return "Aluno não encontrado"
    }

  }

  validarEmailLivre(email:string) : boolean{
    const alunos = this.carregarTodosOsAlunos();
    const retorno = alunos.findIndex(elemento => elemento.email.toLowerCase() == email.toLowerCase());
    if(retorno!==-1){
      return false
    }
    return true
  }


}
