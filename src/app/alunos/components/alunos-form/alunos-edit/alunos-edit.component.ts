import { Component, ChangeDetectionStrategy, inject, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Aluno } from '../../../../core/entity/aluno.model';
import { AlunoService } from '../../../../core/service/alunos/aluno.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-alunos-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    CommonModule,
    MatSnackBarModule,
  ],
  templateUrl: './alunos-edit.component.html',
  styleUrl: './alunos-edit.component.scss'
})
export class AlunosEditComponent {
  private snackBar = inject(MatSnackBar);
  alunoForm: FormGroup;
  instanciaAntiga: Aluno;


  constructor(
    private alunoService: AlunoService,
    @Inject(MAT_DIALOG_DATA) public data: Aluno){
      this.alunoForm = new FormGroup({
      Nome: new FormControl(this.data.Nome, Validators.required),
      Email: new FormControl(this.data.Email, [Validators.required, Validators.email]),
      DataNascimento: new FormControl(this.data.DataNascimento.toISOString().substring(0, 10), Validators.required),
      Sexo: new FormControl(this.data.Sexo, Validators.required),
    });
    this.instanciaAntiga = this.data
    console.log(this.instanciaAntiga)
  }

  copiarAluno() {
    const alunoString = `
      Nome: ${this.alunoForm.get('Nome')?.value}
      Email: ${this.alunoForm.get('Email')?.value}
      Data de Nascimento: ${this.alunoForm.get('DataNascimento')?.value}
      Sexo: ${this.alunoForm.get('Sexo')?.value}
    `;

    navigator.clipboard.writeText(alunoString).then(
      () => {
        this.snackBar.open('Dados copiados com sucesso!', 'Fechar', { duration: 2000 });
      },
      (err) => {
        this.snackBar.open('Falha ao copiar os dados', 'Fechar', { duration: 2000 });
        console.error('Erro ao copiar: ', err);
      }
    );
  }


  editarAluno() {
    if (this.alunoForm.valid) {
      const aluno: Aluno = new Aluno(
        this.alunoForm.get('Nome')!.value,
        this.alunoForm.get('Sexo')!.value,
        this.alunoForm.get('Email')!.value,
        new Date(this.alunoForm.get('DataNascimento')!.value)
      );

      this.alunoService.editarAluno(this.instanciaAntiga, aluno).subscribe(
        (mensagem) => {
          console.log(mensagem);
          this.alunoForm.reset();
          this.alunoService.atualizarAlunos();
          this.snackBar.open(`${mensagem}`, 'Fechar', {
            duration: 2000,
          });
        },
        (error) => {
          this.snackBar.open(`${error}`, 'Fechar', {
            duration: 2000,
          });
        }
      );
    } else {
      console.log('Formulário inválido');
    }
  }

}
