import { Aluno } from './../../../core/entity/aluno.model';
import { Component, ViewChild, inject, AfterViewInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort,MatSortModule,Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AlunoService } from '../../../core/service/alunos/aluno.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { AlunosFormCreateComponent } from "../alunos-form/alunos-form-create/alunos-form-create.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlunosEditComponent } from '../alunos-form/alunos-edit/alunos-edit.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/remove-dialog/remove-dialog.component';
import { PaginatorBR } from '../../../shared/components/paginator-br/paginator-br.component';


@Component({
  selector: 'app-alunos-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    CommonModule,
    ToolbarComponent,
    AlunosFormCreateComponent],
  providers:[{provide:MatPaginatorIntl, useClass:PaginatorBR}],
  templateUrl: './alunos-table.component.html',
  styleUrl: './alunos-table.component.scss'
})

export class AlunosTableComponent implements AfterViewInit  {
  private _liveAnnouncer = inject(LiveAnnouncer);
  private alunoService = inject(AlunoService);
  readonly dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  clickedRows = new Set<Aluno>();
  columns: string[] = ['Nome', 'Email', 'DataNascimento','Sexo',"Acoes"];
  data = new MatTableDataSource<Aluno>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {

    this.alunoService.alunos$.subscribe((alunos) => {
      this.data.data = alunos;
    });
  }

  ngAfterViewInit () {

    this.data.sort = this.sort;
    this.data.paginator = this.paginator;

  }

  announceSortChange(sortState: Sort) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openEditDialog(aluno: Aluno) {

    const dialogRef = this.dialog.open(AlunosEditComponent,{
      data:aluno,
      width: '90%',
      maxWidth: '500px',
      height: 'auto',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${aluno.Nome}`);});
  }

  removerAluno(aluno: Aluno) {

    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { nome: aluno.Nome}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.alunoService.removerAluno(aluno).subscribe(
          (mensagem) => {
            this.alunoService.atualizarAlunos();
            this.snackBar.open(`${mensagem}`, '', {
              duration: 2000,
              panelClass: ['green-snackbar'],
            });
          },
          (error) => {
            this.snackBar.open(`${error}`, 'Fechar', {
              duration: 2000,
              panelClass: ['red-snackbar'],
            });
          }
        );
      }
    });
  }

  applyFilter(filtro: Event) {

    const valor = (filtro.target as HTMLInputElement).value.toLowerCase()

    this.data.filterPredicate = (data: Aluno, valor : string) => {
      return data.Nome.toLowerCase().includes(valor) ||
      data.Email.toLowerCase().includes(valor);
    };

    this.data.filter=valor;
  }
}


