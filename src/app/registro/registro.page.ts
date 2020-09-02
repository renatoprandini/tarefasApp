import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf-validator';
import { ComparacaoValidator } from '../validators/comparacao-validator';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public formRegistro: FormGroup;

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

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.formRegistro = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(14), CpfValidator.cpfValido])],
      dataNasc: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([Validators.maxLength(16)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confSenha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    }, {
      validator: ComparacaoValidator('senha', 'confirmaSenha')
    });
  }

  ngOnInit() {
  }

  public registro() {
    if (this.formRegistro.valid) {
      console.log('formulário válido!');
      this.router.navigateByUrl('/login');
    } else {
      console.log('formulário inválido.');
    }
  }
}
