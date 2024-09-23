export class Aluno{
  Nome: string;
  Sexo: string;
  Email: string;
  DataNascimento: Date;

  constructor(Nome: string, Sexo: string, Email: string, DataNascimento: Date){
    this.Nome = Nome;
    this.Sexo = Sexo;
    this.Email = Email;
    this.DataNascimento = DataNascimento;
  }

  toString() : string{
    return `Nome: ${this.Nome}, Sexo: ${this.Sexo}, Email: ${this.Email}, Data de Nascimento: ${this.DataNascimento}`;
  }

}
