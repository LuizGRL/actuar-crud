import { Component, ChangeDetectionStrategy} from '@angular/core';
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


@Component({
  selector: 'app-alunos-form-create',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alunos-form-create.component.html',
  styleUrl: './alunos-form-create.component.scss'
})
export class AlunosFormCreateComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  alunoForm: FormGroup;

  constructor(private alunoService: AlunoService) {
    this.alunoForm = new FormGroup({
      Nome: new FormControl('', Validators.required),
      Email: new FormControl('', [Validators.required, Validators.email]),
      DataNascimento: new FormControl('', Validators.required),
      Sexo: new FormControl('', Validators.required)
    });
  }

  salvarAluno() {
    if (this.alunoForm.valid) {
      const aluno: Aluno = new Aluno(
        this.alunoForm.value.Nome,
        this.alunoForm.value.Sexo,
        this.alunoForm.value.Email,
        new Date(this.alunoForm.value.DataNascimento)
      );

      this.alunoService.criarAluno(aluno).subscribe(mensagem => {
        console.log(mensagem);
        this.alunoForm.reset();
        location.reload();
      }, error => {
        console.error("Erro ao criar aluno:", error);
      });
    } else {
      console.log("Formulário inválido");
    }
  }

}

