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

  it("Deve retornar erro ao verificar que a lista esta vazia na tentativa de remover aluno",()=>{
    const alunos = service.carregarTodosOsAlunos();
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    const retorno = service.removerAluno(novoAluno);

    expect(retorno).toBe("Não existem elementos para serem excluidos");
    expect(alunos.length).toEqual(0);
  });

  it("Deve retornar erro ao verificar que o usuário solicitado para exclusão não esta na lista",()=>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    const novoAluno2 = new Aluno('Bianca Peixoto', 'F', 'bia12@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);
    const retorno = service.removerAluno(novoAluno2);

    expect(retorno).toBe("Aluno não econtrado");
    expect(service.validarEmailLivre(novoAluno.email)).toEqual(false);
  });

  it("Deve excluir corretamente o usuário",()=>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    const novoAluno2 = new Aluno('Bianca Peixoto', 'F', 'bia12@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);
    service.criarAluno(novoAluno2);
    const listaTamanhoAntes = service.carregarTodosOsAlunos().length
    const retorno = service.removerAluno(novoAluno);
    const listaTamanhoDepois = service.carregarTodosOsAlunos().length

    expect(retorno).toBe("Removido com sucesso");
    expect(listaTamanhoAntes).toBeGreaterThan(listaTamanhoDepois);
    expect(service.buscarAlunoPorEmail(novoAluno2.email)).not.toBeNull();
    expect(service.buscarAlunoPorEmail(novoAluno.email)).toBeNull();
  });

  it("Deve falhar ao tentar editar um aluno com um email ja cadastrado",()=>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    const novoAluno2 = new Aluno('Bianca Peixoto', 'F', 'bia12@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);
    service.criarAluno(novoAluno2);
    const novoAlunoNovaInstancia = new Aluno('Marcos Almeida', 'M', 'bia12@gmail.com', new Date('2000-01-01'));
    const retorno = service.editarAluno(novoAluno,novoAlunoNovaInstancia);

    expect(retorno).toBe("Novo email já esta sendo usado por uma outra conta");
    expect(service.validarEmailLivre(novoAluno.email)).toBeFalse();


  });

  it("Deve falhar ao tentar editar um aluno que não foi encontrado",()=>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);
    const novoAluno2 = new Aluno('Bianca Peixoto', 'F', 'bia12@gmail.com', new Date('2000-01-01'));
    const novoAluno2NovaInstancia = new Aluno('Bianca Andrades', 'F', 'bia12@gmail.com', new Date('2000-01-01'));
    const retorno = service.editarAluno(novoAluno2,novoAluno2NovaInstancia);

    expect(retorno).toBe("Aluno não encontrado");


  });
  it("Deve editar corretamente um aluno",()=>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    const novoAluno2 = new Aluno('Bianca Peixoto', 'F', 'bia12@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);
    service.criarAluno(novoAluno2);
    const novoAlunoNovaInstancia = new Aluno("Carlos Almeida","M", "carlos223@gmail.com",new Date('2000-01-01'));
    const novoAluno2NovaInstancia = new Aluno('Bianca Andrade', 'F', 'bia12@gmail.com', new Date('2000-03-10'));
    const retornoAluno1 = service.editarAluno(novoAluno,novoAlunoNovaInstancia);
    const retornoAluno2 = service.editarAluno(novoAluno2,novoAluno2NovaInstancia);

    expect(service.buscarAlunoPorEmail(novoAluno.email)).toBeNull();
    expect(service.buscarAlunoPorEmail(novoAluno2.email)).toEqual(novoAluno2NovaInstancia);
    expect(service.buscarAlunoPorEmail(novoAlunoNovaInstancia.email)).toEqual(novoAlunoNovaInstancia);
  });

});
