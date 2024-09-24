import { Aluno } from './../../../core/entity/aluno.model';
import { Component, ViewChild, inject, AfterViewInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort,MatSortModule,Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AlunoService } from '../../../core/service/aluno.service';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { AlunosFormCreateComponent } from "../alunos-form/alunos-form-create/alunos-form-create.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlunosEditComponent } from '../alunos-form/alunos-edit/alunos-edit.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-alunos-table',
  standalone: true,
  imports: [MatTableModule, MatSnackBarModule, MatDialogModule, MatSortModule, MatPaginatorModule, CommonModule, ToolbarComponent, AlunosFormCreateComponent],
  templateUrl: './alunos-table.component.html',
  styleUrl: './alunos-table.component.scss'
})

export class AlunosTableComponent implements AfterViewInit  {
  private _liveAnnouncer = inject(LiveAnnouncer);
  private alunoService = inject(AlunoService);
  readonly dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);



  clickedRows = new Set<Aluno>();
  columns: string[] = ['Nome', 'Email', 'DataNascimento','Sexo',"Ações"];
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
    const dialogRef = this.dialog.open(AlunosEditComponent,{data:aluno});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${aluno.Nome}`);
    });
  }

  removerAluno(aluno: Aluno){
    this.alunoService.removerAluno(aluno).subscribe(mensagem => {
      this.alunoService.atualizarAlunos();
      this.snackBar.open(`${mensagem}`, 'Fechar', {
        duration: 10000,
      });

    },
    (error)=>{
      this.snackBar.open(`${error}`, 'Fechar', {
        duration: 2000,
      });
    }
  );


  }
  }


