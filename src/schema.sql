create database market_cubos;

create table usuarios (
	id serial primary key,
  	nome varchar(150) not null,
  	nome_loja varchar(100) not null,
  	email varchar(80) not null unique,
  	senha varchar(8) not null

);

create table produtos (
	id serial primary key,
  	usuario_id int references usuarios(id),
  	nome varchar(80) not null,
  	quantidade int not null,
  	categoria varchar(60),
  	preco int not null,
  	descricao text,
  	imagem text
);
