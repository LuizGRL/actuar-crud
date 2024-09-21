import { TestBed } from '@angular/core/testing';
import { AlunoService } from './aluno.service';
import { Aluno } from '../entity/aluno.model';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importação do módulo


describe('AlunoService', () => {
  let service: AlunoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlunoService],
    });    service = TestBed.inject(AlunoService);
    localStorage.clear();
  });

  it('deve criar um aluno',()=>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);
    const aluno = service.buscarAlunoPorEmail("marcos223@gmail.com")
    expect(aluno?.nome).toBe(novoAluno.nome)

  });

  it('não deve permitir a criação de alunos com um mesmo email',()=>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    const novoAluno2 = new Aluno('Marciel Teixeira', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));

    service.criarAluno(novoAluno);
    const retorno = service.criarAluno(novoAluno2);
    const alunos = service.carregarTodosOsAlunos();

    expect(retorno).toEqual("Erro, Email já foi cadastrado no sistema");
    expect(alunos.length).toBeLessThanOrEqual(1);

  });

  it('não deve permitir a criação de aluno com campos nulo',()=>{
    const novoAluno = new Aluno('Marcos Almeida', '', 'marcos223@gmail.com', new Date('2000-01-01'));
    const novoAluno2 = new Aluno('Marciel Teixeira', 'M', '', new Date('2000-01-01'));
    const novoAluno3 = new Aluno('Bianca Peixoto', 'F', 'bianca@gmail.com', new Date('2000-01-01'));
    const novoAluno4 = new Aluno('', 'F', 'bianca@gmail.com', new Date('2000-01-01'));
    const retorno1 = service.criarAluno(novoAluno);
    const retorno2 = service.criarAluno(novoAluno2);
    const retorno3 = service.criarAluno(novoAluno3);
    const retorno4 = service.criarAluno(novoAluno4);
    const alunos = service.carregarTodosOsAlunos();

    expect(retorno1).toEqual("nenhum campo pode ser nulo");
    expect(retorno2).toEqual("nenhum campo pode ser nulo");
    expect(retorno3).toEqual("Elemento inserido com Sucesso");
    expect(retorno4).toEqual("nenhum campo pode ser nulo");
    expect(alunos.length).toBeLessThanOrEqual(1);
  });

  it('deve achar aluno através do email', () => {
    const aluno1 = new Aluno('John Doe', 'M', 'john@example.com', new Date('2000-01-01'));
    const aluno2 = new Aluno('Jane Doe', 'F', 'jane@example.com', new Date('1999-05-15'));
    service.criarAluno(aluno1);
    service.criarAluno(aluno2);
    const foundAluno = service.buscarAlunoPorEmail('john@example.com');
    expect(foundAluno).toBeTruthy();
    expect(foundAluno?.email).toBe('john@example.com');
  });

  it('deve retornar nulo ao tentar procurar aluno por email que não existe' ,()=>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);

    const foundAluno = service.buscarAlunoPorEmail('marcos223@gmail.com');
    const foundAluno2 = service.buscarAlunoPorEmail('bianca11111@gmail.com');

    expect(foundAluno).toBeTruthy();
    expect(foundAluno?.email).toBe("marcos223@gmail.com");
    expect(foundAluno2).toBe(null);

  });

  it('deve retornar true ao verificar que email esta livre', () =>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);
    const retorno1 = service.validarEmailLivre(novoAluno.email);
    const retorno2 = service.validarEmailLivre("teste@gmail.com");

    expect(retorno2).toBe(true)
  });

  it('deve retornar false ao verificar que email não esta livre',() =>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);
    const retorno1 = service.validarEmailLivre(novoAluno.email);
    const retorno2 = service.validarEmailLivre("teste@gmail.com");

    expect(retorno1).toBe(false)
  });

});
