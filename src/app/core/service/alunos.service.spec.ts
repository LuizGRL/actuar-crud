import { TestBed } from '@angular/core/testing';
import { AlunoService } from './aluno.service';
import { Aluno } from '../entity/aluno.model';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importação do módulo
import { of } from 'rxjs';


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
    expect(aluno?.Nome).toBe(novoAluno.Nome)

  });

  it('não deve permitir a criação de alunos com um mesmo Email',()=>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    const novoAluno2 = new Aluno('Marciel Teixeira', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));

    service.criarAluno(novoAluno);
    const retorno = service.criarAluno(novoAluno2);
    const alunos = service.carregarTodosOsAlunos();
    spyOn(service, 'criarAluno').and.returnValue(of("Erro, Email já foi cadastrado no sistema"));

    service.criarAluno(novoAluno2).subscribe(retorno => {
      expect(retorno).toEqual("Erro, Email já foi cadastrado no sistema");
    });

  });

  it('não deve permitir a criação de aluno com campos nulo', (done) => {
  const novoAluno = new Aluno('Marcos Almeida', '', 'marcos223@gmail.com', new Date('2000-01-01'));
  const novoAluno2 = new Aluno('Marciel Teixeira', 'M', '', new Date('2000-01-01'));
  const novoAluno3 = new Aluno('Bianca Peixoto', 'F', 'bianca@gmail.com', new Date('2000-01-01'));
  const novoAluno4 = new Aluno('', 'F', 'bianca@gmail.com', new Date('2000-01-01'));

  // Simulando os retornos
  spyOn(service, 'criarAluno').and.callFake((aluno: Aluno) => {
    if (aluno.Nome.length <= 0 || aluno.Sexo.length <= 0 || aluno.Email.length <= 0 || aluno.DataNascimento == null) {
      return of("nenhum campo pode ser nulo");
    } else {
      return of("Elemento inserido com Sucesso");
    }
  });

  // Testando cada aluno
  service.criarAluno(novoAluno).subscribe(retorno1 => {
    expect(retorno1).toEqual("nenhum campo pode ser nulo");

    service.criarAluno(novoAluno2).subscribe(retorno2 => {
      expect(retorno2).toEqual("nenhum campo pode ser nulo");

      service.criarAluno(novoAluno3).subscribe(retorno3 => {
        expect(retorno3).toEqual("Elemento inserido com Sucesso");

        service.criarAluno(novoAluno4).subscribe(retorno4 => {
          expect(retorno4).toEqual("nenhum campo pode ser nulo");

          const alunos = service.carregarTodosOsAlunos();
          expect(alunos.length).toBeLessThanOrEqual(1);
          done(); // Finaliza o teste
        });
      });
    });
  });
});

  it('deve achar aluno através do Email', () => {
    const aluno1 = new Aluno('John Doe', 'M', 'john@example.com', new Date('2000-01-01'));
    const aluno2 = new Aluno('Jane Doe', 'F', 'jane@example.com', new Date('1999-05-15'));
    service.criarAluno(aluno1);
    service.criarAluno(aluno2);
    const foundAluno = service.buscarAlunoPorEmail('john@example.com');
    expect(foundAluno).toBeTruthy();
    expect(foundAluno?.Email).toBe('john@example.com');
  });

  it('deve retornar nulo ao tentar procurar aluno por Email que não existe' ,()=>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);

    const foundAluno = service.buscarAlunoPorEmail('marcos223@gmail.com');
    const foundAluno2 = service.buscarAlunoPorEmail('bianca11111@gmail.com');

    expect(foundAluno).toBeTruthy();
    expect(foundAluno?.Email).toBe("marcos223@gmail.com");
    expect(foundAluno2).toBe(null);

  });

  it('deve retornar true ao verificar que Email esta livre', () =>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);
    const retorno1 = service.validarEmailLivre(novoAluno.Email);
    const retorno2 = service.validarEmailLivre("teste@gmail.com");

    expect(retorno2).toBe(true)
  });

  it('deve retornar false ao verificar que Email não esta livre',() =>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);
    const retorno1 = service.validarEmailLivre(novoAluno.Email);
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
    expect(service.validarEmailLivre(novoAluno.Email)).toEqual(false);
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
    expect(service.buscarAlunoPorEmail(novoAluno2.Email)).not.toBeNull();
    expect(service.buscarAlunoPorEmail(novoAluno.Email)).toBeNull();
  });

  it("Deve falhar ao tentar editar um aluno com um Email ja cadastrado",()=>{
    const novoAluno = new Aluno('Marcos Almeida', 'M', 'marcos223@gmail.com', new Date('2000-01-01'));
    const novoAluno2 = new Aluno('Bianca Peixoto', 'F', 'bia12@gmail.com', new Date('2000-01-01'));
    service.criarAluno(novoAluno);
    service.criarAluno(novoAluno2);
    const novoAlunoNovaInstancia = new Aluno('Marcos Almeida', 'M', 'bia12@gmail.com', new Date('2000-01-01'));
    const retorno = service.editarAluno(novoAluno,novoAlunoNovaInstancia);

    expect(retorno).toBe("Novo Email já esta sendo usado por uma outra conta");
    expect(service.validarEmailLivre(novoAluno.Email)).toBeFalse();


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

    expect(service.buscarAlunoPorEmail(novoAluno.Email)).toBeNull();
    expect(service.buscarAlunoPorEmail(novoAluno2.Email)).toEqual(novoAluno2NovaInstancia);
    expect(service.buscarAlunoPorEmail(novoAlunoNovaInstancia.Email)).toEqual(novoAlunoNovaInstancia);
  });

});
