import { Component, ChangeDetectionStrategy, Inject} from '@angular/core';
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
import { AlunoService } from '../../../../core/service/aluno.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  ],
  templateUrl: './alunos-edit.component.html',
  styleUrl: './alunos-edit.component.scss'
})
export class AlunosEditComponent {
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
          location.reload();
        },
        (error) => {
          console.error('Erro ao editar aluno:', error);
        }
      );
    } else {
      console.log('Formulário inválido');
    }
  }

}
