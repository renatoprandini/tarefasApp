import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Usuario } from '../models/Usuario';
import { CpfValidator } from '../validators/cpf-validator';

@Component({
  selector: 'app-alterar-usuario',
  templateUrl: './alterar-usuario.page.html',
  styleUrls: ['./alterar-usuario.page.scss'],
})
export class AlterarUsuarioPage implements OnInit {

  public formAlterar: FormGroup;

  public mensagens_validacao = {
    nome: [
      { tipo: 'required', mensagem: 'O Nome é obrigatório!' },
      { tipo: 'minlength', mensagem: 'O nome deve ter pelo menos 3 caracteres!' }
    ],
    cpf: [
      { tipo: 'required', mensagem: 'O CPF é obrigatório!' },
      { tipo: 'minlength', mensagem: 'O CPF deve ter pelo menos 11 caracteres!' },
      { tipo: 'maxlength', mensagem: 'O CPF deve ter no máximo 14 caracteres!' },
      { tipo: 'invalido', mensagem: 'CPF invalido!' }
    ],
    dataNasc: [
      { tipo: 'required', mensagem: 'A Data de Nascimento é obrigatória!' },
    ],
    genero: [
      { tipo: 'required', mensagem: 'O Gênero é obrigatório!' },
    ],
    celular: [
      { tipo: 'maxlength', mensagem: 'O Celular deve ter no máximo 16 caracteres!' }
    ],
    email: [
      { tipo: 'required', mensagem: 'O Email é obrigatório!' },
      { tipo: 'email', mensagem: 'O Email deve ser válido!' }
    ],
    senha: [
      { tipo: 'required', mensagem: 'O Senha é obrigatória!' },
      { tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres!' }
    ],
    confSenha: [
      { tipo: 'required', mensagem: 'A Confirmação da Senha é obrigatória!' },
      { tipo: 'minlength', mensagem: 'A Confirmação da Senha deve ter pelo menos 6 caracteres!' },
      { tipo: 'comparacao', mensagem: 'Deve ser igual a senha!' }
    ],
  };

  private usuario: Usuario;

  private manterLogadoTemp: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private alertController: AlertController,
    private router: Router,
  ) {
    this.formAlterar = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(14), CpfValidator.cpfValido])],
      dataNasc: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([Validators.maxLength(16)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.preencherFormulario();
  }

  ngOnInit() {
  }

  public async preencherFormulario() {
    this.usuario = await this.usuariosService.buscarUsuarioLogado();
    this.manterLogadoTemp = this.usuario.manterLogado;
    delete this.usuario.manterLogado;

    this.formAlterar.setValue(this.usuario);
    this.formAlterar.patchValue({ dataNasc: this.usuario.dataNasc.toISOString() });
  }

  public async salvar() {
    if (this.formAlterar.valid) {
      this.usuario.nome = this.formAlterar.value.nome;
      this.usuario.dataNasc = new Date(this.formAlterar.value.dataNasc);
      this.usuario.genero = this.formAlterar.value.genero;
      this.usuario.celular = this.formAlterar.value.celular;
      this.usuario.email = this.formAlterar.value.email;

      if(await this.usuariosService.alterar(this.usuario)){
        this.usuario.manterLogado = this.manterLogadoTemp;
        this.usuariosService.salvarUsuarioLogado(this.usuario);
        this.exibirAlerta('Sucesso!', 'Usuário alterado com sucesso!');
        this.router.navigateByUrl('/configuracoes');
      }
    } else {
      this.exibirAlerta('ADVERTENCIA!', 'Formulário inválido<br/>Verifique os campos do seu formulário!');
    }
  }

  async exibirAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }
}
