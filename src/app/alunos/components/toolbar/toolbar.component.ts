import { Component, inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlunosFormCreateComponent } from '../alunos-form/alunos-form-create/alunos-form-create.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

  readonly dialog = inject(MatDialog);
  openDialog() {
    const dialogRef = this.dialog.open(AlunosFormCreateComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  public changeFilter = (e: Event) => {
    const a =(e.target as HTMLInputElement).value.toLowerCase()
  }
}
