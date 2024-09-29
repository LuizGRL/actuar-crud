import { Component, ChangeDetectionStrategy, inject} from '@angular/core';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alunos-form-create',
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
    MatSnackBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alunos-form-create.component.html',
  styleUrls: ['./alunos-form-create.component.scss'],
})

export class AlunosFormCreateComponent {

  private snackBar = inject(MatSnackBar);
  alunoForm: FormGroup;

  constructor(private alunoService: AlunoService) {

    this.alunoForm = new FormGroup({
      Nome: new FormControl('', Validators.required),
      Email: new FormControl('', [Validators.required, Validators.email]),
      DataNascimento: new FormControl('', Validators.required),
      Sexo: new FormControl('', Validators.required),
    });
  }

  salvarAluno() {

    if (this.alunoForm.valid) {
      const aluno: Aluno = new Aluno(
        this.alunoForm.get('Nome')!.value,
        this.alunoForm.get('Sexo')!.value,
        this.alunoForm.get('Email')!.value,
        new Date(this.alunoForm.get('DataNascimento')!.value)
      );

      this.alunoService.criarAluno(aluno).subscribe(
        (mensagem) => {
          console.log(mensagem);
          this.alunoForm.reset();
          this.alunoService.atualizarAlunos();
          this.snackBar.open(`${mensagem}`, '', {
            duration: 2000,
            panelClass:["green-snackbar"]
          });
        },
        (error) => {
          this.snackBar.open(`${error}`, '', {
            duration: 2000,
            panelClass:["red-snackbar"]
          });
        }
      );
    } else {
      console.log('Formulário inválido');
    }
  }
}
