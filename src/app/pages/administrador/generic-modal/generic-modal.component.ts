
import { DomSanitizer } from '@angular/platform-browser';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { idEmpresa, environment } from 'src/environments/environment.prod';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { AlertService } from 'src/app/services/alert.service';
import { GenericService } from 'src/app/services/generic.service';
import { LoaderService } from 'src/app/services/loading-service';
import { SqlGenericService } from 'src/app/services/sqlGenericService';
@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss']
})
export class GenericModalComponent implements OnInit {

  public img: any = environment.getImagenIndividual;
  public filesInfo: any = {};
  public temas: any[] = [];
  public complejidades: any[] = [];
  public respuestaTemporal: string = "";
  public respuestasTemporales: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private parentDilogRef: MatDialogRef<any>,
    private alertService: AlertService,
    private domSanitizer: DomSanitizer,
    private sqlGenericService: SqlGenericService,
    private loadingService: LoaderService,
    private genericService: GenericService) {
  }

  ngOnInit(): void {
    /*
    pregunta: "",
          respuesta: "",
          id_tema: null,
          id: null
    */
    switch (this.data.id) {
      case 1:
        this.data.idArchivo = this.data.current.id_archivo;
        break;
      case 2:
        this.cargarTemas();
        break;
      case 3:
        this.cargarTemas();
        this.cargarComplejidades();
        break;
      default:
        break;
    }
  }

  changeImg(evt: any) {
    console.log("------------------------------------");

    let file: any = evt.target.files[0];
    if (file.size > 2000000) {
      this.alertService.warnAlert(
        "Ooops!",
        "Tu archivo debe ser de máximo 2MB de tamaño, Intenta nuevamente con otro archivo",
        () => {
          ////console.log("hola");
        }
      );
    } else if (
      file.type != "image/png" &&
      file.type != "image/jpg" &&
      file.type != "image/jpeg" &&
      file.type != "image/svg+xml"
    ) {
      this.alertService.warnAlert(
        "Ooops!",
        "Solo aceptamos archivos en formato png, jpg y svg",
        () => {
          ////console.log("hola");
        }
      );
    } else {

      this.filesInfo = {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name,
        size: file.size,
        type: file.type,
        namer: "",
        descripcion: ""
      };

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (file.type == "image/svg+xml") {
          let img: any = new Image();
          img.src = reader.result;

          img.onload = () => {
            let canvas: any = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            let context: any = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
            let png: any = canvas.toDataURL("image/png");
            //console.log(png);
            switch (this.data.id) {
              case 1:
                this.data.current.b64 = png;
                this.data.current.id_archivo = null;
                break;

              default:
                break;
            }

          };

        } else {
          switch (this.data.id) {
            case 1:
              this.data.current.b64 = reader.result;
              this.data.current.id_archivo = null;
              break;

            default:
              break;
          }
        }

      };
      reader.onerror = error => {
        ////console.log("Error: ", error);
      };
    }
  }

  add() {
    switch (this.data.id) {
      case 1:
        if (this.data.status) {
          this.editTema();
        } else {
          this.createTema();
        }
        break;
      case 2:
        if (this.data.status) {
          this.editPregunta();
        } else {
          this.createPregunta();
        }
        break;
      case 3:
        if (this.data.status) {
          this.editTrivia();
        } else {
          this.createTrivia();
        }
        break;
      default:
        break;
    }
  }

  onConfirmClick() {
    this.parentDilogRef.close(false);
  }

  ///CREATES
  createTema() {
    if (this.data.current.label.length == 0) {
      this.alertService.warnAlert("Espera!", "El campo descripción es requerido");
    } else {

      if (this.data.current.b64.length > 0) {
        let fls: any[] = [];
        fls.push({ ...this.filesInfo, base64: this.data.current.b64 });

        let request = {
          files: fls,
          idAdjunto: this.data.idArchivo,
          idEmpresa: idEmpresa,
          tipo: 31,
          name: this.data.current.label,
          description: this.data.current.label,
          multi: true
        };

        this.loadingService.show("Agregando...");
        this.genericService
          .sendPostRequest(environment.loadBlobOnly, request)
          .subscribe(
            (response: any) => {
              let idArchivo = response.parameters;
              let sqlTema = `INSERT INTO catalogo (id_tipo_catalogo, id_empresa, descripcion, nombre, id_archivo) VALUES ('31', ${idEmpresa}, '${this.data.current.label}', '${this.data.current.label}', ${idArchivo})`;
              console.log(sqlTema);

              this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
                //Se registra correctamente nuevo usuario
                this.alertService.successAlert("Bien!", "Tema creado exitosamente");
                this.parentDilogRef.close(false);
                this.loadingService.hide();
                //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
                //this.listenNotifications();
              }, (err: HttpErrorResponse) => {
                this.loadingService.hide();
              });
            },
            (error: HttpErrorResponse) => {
              this.loadingService.hide();
              this.alertService.errorAlert(
                "Ooops!",
                "Ha sucedido un error, intenta recargar nuevamente, si el error persiste contacta a un administrador",
                () => {
                  ////console.log("hola");
                }
              );
            }
          );
      } else {
        let sqlTema2 = `INSERT INTO catalogo (id_tipo_catalogo, id_empresa, descripcion, nombre) VALUES ('31', ${idEmpresa}, '${this.data.current.label}', '${this.data.current.label}')`;

        this.sqlGenericService.excecuteQueryString(sqlTema2).subscribe((resp: any) => {
          //Se registra correctamente nuevo usuario
          this.alertService.successAlert("Bien!", "Tema creado exitosamente");
          this.parentDilogRef.close(false);
          this.loadingService.hide();
          //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
          //this.listenNotifications();
        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
        });
      }

    }
  }

  createPregunta() {
    if (this.data.current.pregunta.length == 0 ||
      this.data.current.respuesta.length == 0 ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else {

      let sqlTema2 = `INSERT INTO preguntas_frecuentes (id_tema, id_empresa, pregunta, respuesta) VALUES (${this.data.current.id_tema}, ${idEmpresa}, '${this.data.current.pregunta}', '${this.data.current.respuesta}')`;

      this.sqlGenericService.excecuteQueryString(sqlTema2).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario
        this.alertService.successAlert("Bien!", "Pregunta Frecuente creada exitosamente");
        this.parentDilogRef.close(false);
        this.loadingService.hide();
        //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
        //this.listenNotifications();
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });

    }
  }

  createTrivia() {
    let error: number = 0;

    this.data.current.respuestas.forEach(element => {
      if (!element.correcto) {
        error++;
      }
    });
    console.log(this.data.current);

    if (this.data.current.pregunta.length == 0 ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null ||
      this.data.current.id_complejidad == 0 ||
      this.data.current.id_complejidad == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else if (this.data.current.respuestas.length < 4) {
      this.alertService.warnAlert("Espera!", "Agrega por lo menos 4 respuestas");
    } else if (!this.data.current.respuesta) {
      this.alertService.warnAlert("Espera!", "Selecciona una respuesta correcta");
    } else {
      let jsonObj: any = {
        pregunta: this.data.current.pregunta,
        respuestas: this.data.current.respuestas,
        respuesta: this.data.current.respuesta
      };

      let json = JSON.stringify(jsonObj);
      let sqlTema2 = `INSERT INTO trivia (id_tema, id_complejidad, id_empresa, json_trivia) VALUES (${this.data.current.id_tema}, ${this.data.current.id_complejidad}, ${idEmpresa}, '${json}')`;

      this.sqlGenericService.excecuteQueryString(sqlTema2).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario
        this.alertService.successAlert("Bien!", "Trivia creada exitosamente");
        this.parentDilogRef.close(false);
        this.loadingService.hide();
        //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
        //this.listenNotifications();
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });

    }
  }

  editTema() {
    if (this.data.current.label.length == 0) {
      this.alertService.warnAlert("Espera!", "El campo descripción es requerido");
    } else {
      if (this.data.current.b64.length > 0) {
        let fls: any[] = [];
        fls.push({ ...this.filesInfo, base64: this.data.current.b64 });

        let request = {
          files: fls,
          idAdjunto: this.data.idArchivo,
          idEmpresa: idEmpresa,
          tipo: 31,
          name: this.data.current.label,
          description: this.data.current.label,
          multi: true
        };

        this.loadingService.show("Actualizando...");
        this.genericService
          .sendPostRequest(environment.loadBlobOnly, request)
          .subscribe(
            (response: any) => {
              let idArchivo = response.parameters;
              let sqlTema = `UPDATE catalogo SET descripcion = '${this.data.current.label}', nombre = '${this.data.current.label}', id_archivo = ${idArchivo} WHERE id = ${this.data.current.id}`;
              console.log(sqlTema);

              this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
                //Se registra correctamente nuevo usuario
                this.alertService.successAlert("Bien!", "Tema actualizado exitosamente");
                this.parentDilogRef.close(false);
                this.loadingService.hide();
                //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
                //this.listenNotifications();
              }, (err: HttpErrorResponse) => {
                this.loadingService.hide();
              });
            },
            (error: HttpErrorResponse) => {
              this.loadingService.hide();
              this.alertService.errorAlert(
                "Ooops!",
                "Ha sucedido un error, intenta recargar nuevamente, si el error persiste contacta a un administrador",
                () => {
                  ////console.log("hola");
                }
              );
            }
          );



      } else {
        let sqlTema = `UPDATE catalogo SET descripcion = '${this.data.current.label}', nombre = '${this.data.current.label}' WHERE id = ${this.data.current.id}`;
        console.log(sqlTema);

        this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
          //Se registra correctamente nuevo usuario
          this.alertService.successAlert("Bien!", "Tema actualizado exitosamente");
          this.parentDilogRef.close(false);
          this.loadingService.hide();
          //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
          //this.listenNotifications();
        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
        });
      }
    }
  }

  editPregunta() {
    if (this.data.current.pregunta.length == 0 ||
      this.data.current.respuesta.length == 0 ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else {

      let sqlTema = `UPDATE preguntas_frecuentes SET pregunta = '${this.data.current.pregunta}', respuesta = '${this.data.current.respuesta}', id_tema = ${this.data.current.id_tema} WHERE id = ${this.data.current.id}`;
      console.log(sqlTema);

      this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario
        this.alertService.successAlert("Bien!", "Pregunta Frecuente actualizada exitosamente");
        this.parentDilogRef.close(false);
        this.loadingService.hide();
        //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
        //this.listenNotifications();
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });

    }
  }

  editTrivia() {
    let error: number = 0;
    console.log(this.data);
    
    this.data.current.respuestas.forEach(element => {
      if (!element.correcto) {
        error++;
      }
    });
    if (this.data.current.pregunta.length == 0 ||
      this.data.current.id_tema == 0 ||
      this.data.current.id_tema == null ||
      this.data.current.id_complejidad == 0 ||
      this.data.current.id_complejidad == null) {
      this.alertService.warnAlert("Espera!", "Todos los campos son requeridos");
    } else if (this.data.current.respuestas.length < 4) {
      this.alertService.warnAlert("Espera!", "Agrega por lo menos 4 respuestas");
    } else if (!this.data.current.respuesta) {
      this.alertService.warnAlert("Espera!", "Selecciona una respuesta correcta");
    } else {
      let jsonObj: any = {
        pregunta: this.data.current.pregunta,
        respuestas: this.data.current.respuestas,
        respuesta: this.data.current.respuesta
      };

      let json = JSON.stringify(jsonObj);
      let sqlTema = `UPDATE trivia SET json_trivia = '${json}', id_tema = ${this.data.current.id_tema}, id_complejidad = ${this.data.current.id_complejidad} WHERE id = ${this.data.current.id}`;
      console.log(sqlTema);

      this.sqlGenericService.excecuteQueryString(sqlTema).subscribe((resp: any) => {
        //Se registra correctamente nuevo usuario
        this.alertService.successAlert("Bien!", "Trivia actualizada exitosamente");
        this.parentDilogRef.close(false);
        this.loadingService.hide();
        //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
        //this.listenNotifications();
      }, (err: HttpErrorResponse) => {
        this.loadingService.hide();
      });

    }
  }

  /**Combos */
  cargarTemas() {
    let sql: string = `SELECT id, descripcion as label FROM catalogo WHERE id_tipo_catalogo = 31 AND id_empresa = ${idEmpresa}`;

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.temas = resp.parameters;
      this.temas.unshift({ id: null, label: "[--Selecciona--]" });
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarComplejidades() {
    let sql: string = `SELECT id, descripcion as label FROM catalogo WHERE id_tipo_catalogo = 32 AND id_empresa = ${idEmpresa}`;

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.complejidades = resp.parameters;
      this.complejidades.unshift({ id: null, label: "[--Selecciona--]" });
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  /**Operaciones variadas */
  aniadir() {
    let epoch = Date.now();
    if (this.respuestaTemporal.length > 0) {
      this.data.current.respuestas.push({
        correcta: false,
        respuesta: this.respuestaTemporal,
        id: epoch
      });
      this.respuestaTemporal = "";
    }
  }

  remove(position) {
    this.data.current.respuestas.splice(position, 1);
  }

  cambio(evt: any, position) {
    /* console.log(evt);
    console.log(this.data.current.respuesta);
     */
  }
}
