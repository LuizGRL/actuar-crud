# Actuar Crud

Projeto desenvolvido para um processo seletivo utilizando angular.

## Como rodar ?

Primeiro passo é executar o comando npm install e logo após o comando npm start. Caso acontece algum erro pode ser necessário instalar a biblioteca do Angular Materials usando o comando ng add @angular/material.

Para executar os testes basta executar o comando ng test.

Caso o site seja executado usando o comando ng serve --host IP:PORTA, à funcionalidade presente na tela de edição "COPIAR DADOS" não vai funcionar.

## Como funciona ?

Assim que o projeto incia caso o localStorage usado não contenha dados, será realizado o import dos dados via api, isso acontece na primeria vez que o código é executado e também caso todos os dados na tabela sejam apagados. A funcionalidade desse import poderia ter sido implementada usando um botão contudo achei mais viável realizar ela toda vez que a tabela estiver vazia facilidando algum teste manual.

## Telas no computador: 

![image](https://github.com/user-attachments/assets/e98d1f0d-ed85-46a7-b2f8-9e6dec379a72)

*Campo 1: Apresenta funções para limitar quantos elementos podem aparecer na tela incial (5, 10, 15 linhas), caso a quantidade de alunos seja maior que a quantidade de linhas permitadas é possível mudar de página atráves das setas no canto esquerdo.
*Campo 2: Apresenta os botões para editar ou remover um elemento.
*Campo 3: É possível ordenar os elementos de uma coluna apertando em cima da coluna.
*Campo 4: É possível filtrar um aluno digitando o nome ou email, cadastrar um novo aluno ou exportar toda a base de dados em formato csv.

![image](https://github.com/user-attachments/assets/85aa47be-533a-4ea8-92ee-806ea6f7df05)

A tela à cima representa o cadastro de um novo aluno, todos os campos são obrigatórios e são feitas algumas validações na classe de serviço (como não permitir email repetido), para sair dela basta apertar a tecla ESC ou clicar fora da caixa.

![image](https://github.com/user-attachments/assets/8ca8d601-8cbc-4ebd-af1e-76ac6416f7ce)

A tela à cima representa a edição de um novo aluno, todos os campos são obrigatórios e são feitas algumas validações na classe de serviço (como não permitir email repetido, mas nesse caso se o email não for alterado a edição é permitida), para sair dela basta apertar a tecla ESC ou clicar fora da caixa. Além disso tem a funcionalidade de copiar os dados que ir retornar algo como: Nome: Maria Pereira Email: maria@mail.com Data de Nascimento: 1996-01-01 Sexo: F.

![image](https://github.com/user-attachments/assets/c2118a55-3d89-4749-b333-fe7279ffa011)

A tela à cima representa a exclusão de um ano, podendo confirmar ou cancelar à ação.

## Telas no celular: 
Todas as funcionalidade permanecem às mesmas com exceção da tabela que permite a rolagem para todo o seu conteúdo.

![image](https://github.com/user-attachments/assets/e570f227-aa01-483b-b630-e4567d9e1eb5)

![image](https://github.com/user-attachments/assets/bca579db-7ca2-4ee5-8040-42cecc4b6a07)

![image](https://github.com/user-attachments/assets/5e166920-b4d8-44af-a3bd-26364a7f4a38)

![image](https://github.com/user-attachments/assets/a4ef5049-a1ea-4309-af9e-b785fa0d80a2)

![image](https://github.com/user-attachments/assets/f3d53fe7-870e-48fc-aa85-42143626e66e)

## Finalização

Agradeço fortemente pela oportunidade que me foi dada e pelo tempo empenhado na avaliação deste projeto. Foi meu primeiro grande contato com Angular, começando uma tela desde o seu início e não apenas fazendo manutenção. Foi desafiador e divertido! Muito obrigado por me proporcionarem esse enriquecimento!











