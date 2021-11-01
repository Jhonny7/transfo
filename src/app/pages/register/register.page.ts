import { LoaderService } from './../../services/loading-service';
import { LoadingService } from './../../services/loading.service';
import { SqlGenericService } from './../../services/sqlGenericService';
import { AlertService } from './../../services/alert.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { idEmpresa } from 'src/environments/environment.prod';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public data: any = {
    email: {
      error: false,
      value: ""
    },
    nombre: {
      error: false,
      value: ""
    },
    apellido_paterno: {
      error: false,
      value: ""
    },
    apellido_materno: {
      error: false,
      value: "",
      exclude: true,
    },
    pass: {
      error: false,
      value: ""
    },
    confirm_pass: {
      error: false,
      value: ""
    },
  };

  constructor(
    private alertService: AlertService,
    private sqlGenericService: SqlGenericService,
    private loadingService: LoaderService
  ) {

  }

  ngOnInit() {
    //this.alertService.errorAlert("Oops!","Datos incorrectos");
    
  }


  register() {
    let keys: any = Object.keys(this.data);
    let error: number = 0;

    keys.forEach(key => {
      if (this.data[key].value.length <= 0 && !this.data[key].exclude) {
        this.data[key].error = true;
        error++;
      } else {
        this.data[key].error = false;
      }
    });
    this.loadingService.show("Registrando...");
    if (error > 0) {
      this.alertService.warnAlert("Oops!", "Llena todos los campos marcados con (*)");
    } else if (this.data.pass.value != this.data.confirm_pass.value) {
      this.alertService.warnAlert("Oops!", "Las contraseñas deben coincidir");
    } else {
      let sqlUser: string = `SELECT username FROM usuario WHERE username = '${this.data.email.value}'`;
      this.sqlGenericService.excecuteQueryString(sqlUser).subscribe((response: any) => {
        if (response.parameters.length <= 0) {
          let sql: string = `INSERT INTO usuario (id_tipo_usuario, id_empresa, uuid, token, nombre, apellido_paterno, apellido_materno, language, last_session, password, username) VALUES ('129', '${idEmpresa}', 'web', 'web', '${this.data.nombre.value}', '${this.data.apellido_paterno.value}', '${this.data.apellido_materno.value}', 'es', now(), SHA2(MD5(UNHEX(SHA2('${this.data.pass.value}',512))),224), '${this.data.email.value}')`;
          this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
            keys.forEach(key => {
              this.data[key].value = "";
            });
            this.loadingService.hide();
            setTimeout(() => {
              this.backing();
            }, 500);
            ////console.log(response);
          }, (error: HttpErrorResponse) => {
            this.loadingService.hide();
            this.alertService.errorAlert("Oops", `El usuario ${this.data.email.value} no se ha registrado, intenta nuevamente`);
          });
        } else {
          this.loadingService.hide();
          this.alertService.errorAlert("Oops", `El usuario ${this.data.email.value} ya se encuentra registrado`);
        }
      }, (error: HttpErrorResponse) => {

      });
    }
  }

  change() {
    let id: any = document.getElementById("input-pass");
    if (id.type == "text") {
      id.type = "password";
    } else {
      id.type = "text";
    }
  }

  backing() {
    window.history.back();
  }

}
