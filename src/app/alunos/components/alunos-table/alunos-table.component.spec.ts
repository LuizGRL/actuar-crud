import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlunosTableComponent } from './alunos-table.component';
import { AlunoService } from '../../../core/service/alunos/aluno.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AlunosTableComponent', () => {
  let component: AlunosTableComponent;
  let fixture: ComponentFixture<AlunosTableComponent>;
  let alunoService: jasmine.SpyObj<AlunoService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const alunoServiceMock = jasmine.createSpyObj('AlunoService', ['alunos$', 'removerAluno', 'atualizarAlunos']);
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        AlunosTableComponent,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AlunoService, useValue: alunoServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlunosTableComponent);
    component = fixture.componentInstance;
    alunoService = TestBed.inject(AlunoService) as jasmine.SpyObj<AlunoService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    alunoService.alunos$ = of([
      { Nome: 'Luiz', Email: 'luiz@main.com', Sexo: 'Masculino', DataNascimento: new Date() },
      { Nome: 'Bruna', Email: 'bruna@main.com', Sexo: 'Feminino', DataNascimento: new Date() }
    ]);

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar alunos na tabela', () => {
    component.ngOnInit();
    expect(component.data.data.length).toBe(2);
  });

  it('deve aplicar o filtro na tabela', () => {
    const event = { target: { value: 'Luiz' } } as unknown as Event;
    component.applyFilter(event);
    expect(component.data.filter).toBe('luiz');
    expect(component.data.filteredData.length).toBe(1);
  });

});
