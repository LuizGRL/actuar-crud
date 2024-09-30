import { TestBed } from '@angular/core/testing';
import { AlunoService } from './aluno.service';
import { Aluno } from '../../entity/aluno.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

describe('AlunoService', () => {
  let service: AlunoService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports:[HttpClientTestingModule]});
    service = TestBed.inject(AlunoService);
    localStorage.clear();
  });

  it('deve retornar alunos armazenados no localStorage', () => {
    const mockAlunos: Aluno[] = [
      new Aluno('Luiz', 'Masculino', 'luiz@main.com', new Date('2000-01-01'))
    ];
    localStorage.setItem('alunos', JSON.stringify(mockAlunos));

    const alunos = service.carregarTodosOsAlunos();
    expect(alunos.length).toBe(1);
    expect(alunos[0].Nome).toBe('Luiz');
  });

  it('deve retornar um array vazio se não houver alunos no localStorage', () => {
    const alunos = service.carregarTodosOsAlunos();
    expect(alunos.length).toBe(0);
  });

  it('deve buscar aluno por email', () => {
    const mockAlunos: Aluno[] = [
      new Aluno('Luiz', 'Masculino', 'luiz@mail.com', new Date('2000-01-01'))
    ];
    localStorage.setItem('alunos', JSON.stringify(mockAlunos));

    const aluno = service.buscarAlunoPorEmail('luiz@mail.com');
    expect(aluno?.Nome).toBe('Luiz');
  });

  it('deve retornar null se o aluno não for encontrado', () => {
    const aluno = service.buscarAlunoPorEmail('brunca@mail.com');
    expect(aluno).toBeNull();
  });

  it('deve atualizar os alunos no BehaviorSubject', () => {
    const mockAlunos: Aluno[] = [
      new Aluno('Luiz', 'Masculino', 'luiz@mail.com', new Date('2000-01-01'))
    ];
    localStorage.setItem('alunos', JSON.stringify(mockAlunos));

    service.atualizarAlunos();

    service.alunos$.subscribe(alunos => {
      expect(alunos.length).toBe(1);
      expect(alunos[0].Nome).toBe('Luiz');
    });
  });

  it('deve criar um novo aluno', (done: DoneFn) => {
    const aluno = new Aluno('Luiz', 'Masculino', 'luiz@mail.com', new Date('2000-01-01'))

    service.criarAluno(aluno).subscribe({
      next: mensagem => {
        expect(mensagem).toBe('Elemento inserido com Sucesso');
        const alunos = service.carregarTodosOsAlunos();
        expect(alunos.length).toBe(1);
        expect(alunos[0].Nome).toBe('Luiz');
        done();
      },
      error: () => done.fail('Não deveria retornar erro')
    });
  });

  it('deve retornar erro se o email já estiver cadastrado', (done: DoneFn) => {
    const mockAlunos: Aluno[] = [
      new Aluno('Luiz', 'Masculino', 'luiz@mail.com', new Date('2000-01-01'))
    ];
    localStorage.setItem('alunos', JSON.stringify(mockAlunos));

    const novaInstancia = new Aluno('Luiz', 'Masculino', 'luiz@mail.com', new Date('2000-01-01'))

    service.criarAluno(novaInstancia).subscribe({
      next: () => done.fail('Deveria retornar erro'),
      error: mensagem => {
        expect(mensagem).toBe('Erro, Email já foi cadastrado no sistema');
        done();
      }
    });
  });

  it('deve remover um aluno', (done: DoneFn) => {
    const mockAlunos: Aluno[] = [
      new Aluno('Luiz', 'Masculino', 'luiz@mail.com', new Date('2000-01-01'))
    ];
    localStorage.setItem('alunos', JSON.stringify(mockAlunos));

    service.removerAluno(mockAlunos[0]).subscribe({
      next: mensagem => {
        expect(mensagem).toBe('Removido com sucesso');
        const alunos = service.carregarTodosOsAlunos();
        expect(alunos.length).toBe(0);
        done();
      },
      error: () => done.fail('Não deveria retornar erro')
    });
  });

  it('deve editar um aluno', (done: DoneFn) => {

    const mockAlunos: Aluno[] = [
      new Aluno('Luiz', 'Masculino', 'luiz@mail.com', new Date('2000-01-01'))
    ];

    localStorage.setItem('alunos', JSON.stringify(mockAlunos));

    const novoAluno = new Aluno('Luiz Guilherme', 'Masculino', 'luizG@mail.com', new Date('2000-01-01'));

    service.editarAluno(mockAlunos[0], novoAluno).subscribe({
      next: mensagem => {
        expect(mensagem).toBe('Aluno editado com sucesso');
        const alunos = service.carregarTodosOsAlunos();
        expect(alunos[0].Nome).toBe('Luiz Guilherme');
        expect(alunos[0].Email).toBe('luizG@mail.com');
        done();
      },
      error: () => done.fail('Não deveria retornar erro')
    });
  });

  it('deve retornar erro se o email já estiver em uso', (done: DoneFn) => {
    const mockAlunos: Aluno[] = [
      new Aluno('Luiz', 'Masculino', 'luiz@mail.com', new Date('2000-01-01')),
      new Aluno('Bruna', 'Feminino', 'bruna@mail.com', new Date('2000-02-01'))
    ];

    localStorage.setItem('alunos', JSON.stringify(mockAlunos));

    const novoAluno = new Aluno('Luiz Guilherme', 'Masculino', 'bruna@mail.com', new Date('2000-01-01'));

    service.editarAluno(mockAlunos[0], novoAluno).subscribe({
      next: () => done.fail('Deveria retornar erro'),
      error: mensagem => {
        expect(mensagem).toBe("Novo Email já está sendo usado por uma outra conta");
        done();
      }
    });
  });

  it('deve retornar erro se o aluno não for encontrado', (done: DoneFn) => {
    const mockAlunos: Aluno[] = [
      new Aluno('Luiz', 'Masculino', 'luiz@mail.com', new Date('2000-01-01'))
    ];

    localStorage.setItem('alunos', JSON.stringify(mockAlunos));

    const alunoInexistente = new Aluno('Bruna', 'Feminino', 'bruna@mail.com', new Date('2000-01-01'));

    service.editarAluno(alunoInexistente, alunoInexistente).subscribe({
      next: () => done.fail('Deveria retornar erro'),
      error: mensagem => {
        expect(mensagem).toBe("Aluno não encontrado");
        done();
      }
    });
  });

  it('deve validar se o email está livre', () => {
    const mockAlunos: Aluno[] = [
      new Aluno('Luiz', 'Masculino', 'luiz@mail.com', new Date('2000-01-01'))
    ];
    localStorage.setItem('alunos', JSON.stringify(mockAlunos));

    const emailLivre = service.validarEmailLivre('bruna@mail.com');
    expect(emailLivre).toBeTrue();

    const emailNaoLivre = service.validarEmailLivre('luiz@mail.com');
    expect(emailNaoLivre).toBeFalse();
  });

});
