import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlunosFormCreateComponent } from '../alunos-form/alunos-form-create/alunos-form-create.component';

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
    const a = (e.target as HTMLInputElement).value.toLowerCase()
  }

  exportarDadosParaCSV(filename: string) {

    const data = JSON.parse(localStorage.getItem('alunos') || '[]');
    const csvRows = [];
    const headers = Object.keys(data[0]).join(';');

    csvRows.push(headers);

    for (const row of data) {
      const values = Object.values(row).map(value => `"${value}"`).join(';');
      csvRows.push(values);
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
  }

}
