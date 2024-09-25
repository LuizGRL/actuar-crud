import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-dialog',
  template: `
    <h1 mat-dialog-title>Confirmar Exclusão</h1>
    <div mat-dialog-content>
      <p>Tem certeza de que deseja excluir o aluno <strong>{{ data.nome }}</strong>?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-button color="warn" (click)="onConfirm()">Excluir</button>
    </div>
  `,
})

export class ConfirmDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
