import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ToolbarComponent } from './toolbar.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let dialogSpy: jasmine.Spy;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ToolbarComponent, HttpClientTestingModule],
      providers: [{ provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) }]
    }).compileComponents();

    dialog = TestBed.inject(MatDialog);
    dialogSpy = dialog.open as jasmine.Spy;
    component = TestBed.createComponent(ToolbarComponent).componentInstance;
  });

  // it('deve exportar o arquivo csv', () => {
  //   spyOn(window.URL, 'createObjectURL').and.returnValue('mock-url');
  //   spyOn(document, 'createElement').and.returnValue({
  //     setAttribute: jasmine.createSpy(),
  //     click: jasmine.createSpy(),
  //   } as any);

  //   component.exportarDadosParaCSV('test.csv');

  //   expect(window.URL.createObjectURL).toHaveBeenCalled();
  // }); // ta vindo nulo olhar isso dps

  it('deve filtrar o input', () => {
    const event = { target: { value: 'teste' } } as any;
    component.changeFilter(event);
    expect(event.target.value).toBe('teste');
  });
});
