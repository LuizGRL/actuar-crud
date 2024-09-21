export class Aluno{
  nome: string;
  sexo: string;
  email: string;
  dataNascimento: Date;

  constructor(nome: string, sexo: string, email: string, dataNascimento: Date){
    this.nome = nome;
    this.sexo = sexo;
    this.email = email;
    this.dataNascimento = dataNascimento;
  }

  toString() : string{
    return `Nome: ${this.nome}, Sexo: ${this.sexo}, Email: ${this.email}, Data de Nascimento: ${this.dataNascimento}`;
  }

}
