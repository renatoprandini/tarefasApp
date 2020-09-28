import { Injectable } from '@angular/core';
import { ArmazenamentoService } from './armazenamento.service';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  public listaUsuarios = [];

  constructor(private armazenamentoService: ArmazenamentoService) { }

  public async buscarTodos() {
    this.listaUsuarios = await this.armazenamentoService.pegarDados('usuarios');

    if (!this.listaUsuarios) {
      this.listaUsuarios = [];
    }
  }

  public async salvar(usuario: Usuario) {
    await this.buscarTodos();

    if (!usuario) {
      return false;
    }

    if (!this.listaUsuarios) {
      this.listaUsuarios = [];
    }

    this.listaUsuarios.push(usuario);

    return await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios);
  }

  public async login(email: string, senha: string) {
    let usuario: Usuario;

    await this.buscarTodos();

    const listaTemporaria = this.listaUsuarios.filter(usuarioArmazenado => {
      return (usuarioArmazenado.email === email && usuarioArmazenado.senha === senha);
    });

    if (listaTemporaria.length > 0) {
      usuario = listaTemporaria.reduce(item => item);
    }

    return usuario;
  }

  public salvarUsuarioLogado(usuario: Usuario) {
    delete usuario.senha;
    this.armazenamentoService.salvarDados('usuarioLogado', usuario);
  }

  public async buscarUsuarioLogado(){
    return await this.armazenamentoService.pegarDados('usuarioLogado');
  }

  public async removerUsuarioLogado() {
    return await this.armazenamentoService.removerDados('usuarioLogado');
  }

  public async alterar(usuario: Usuario){
    if(!usuario){ // teste se o usuário é válido
      return false; // se não for não acontece nada
    }

    await this.buscarTodos(); // método para atualizar a lista de usuários

    const index = this.listaUsuarios.findIndex(usuarioArmazenado => { // método para encontrar em qual posição o usuário está no array dentro do storage
      return usuarioArmazenado.email == usuario.email; 
    }); // procura dentro do array de lista de usuários se possui algum usuario onde o email é igual o usuario que veio na hora de alterar

    const usuarioTemporario = this.listaUsuarios[index] as Usuario; // criação de um usuário temporário para fazer comparações

    usuario.senha = usuarioTemporario.senha; // Recuperando a senha do usuário que estava no storage e colocando no novo usuário

    this.listaUsuarios[index] = usuario; // Sobrescrição dos usuários

    return await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios); // Valor que irá retornar para o alterar usuário
  }
}
