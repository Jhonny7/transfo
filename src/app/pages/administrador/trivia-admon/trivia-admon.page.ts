import { AlertService } from './../../../services/alert.service';
import { environment, idEmpresa } from 'src/environments/environment.prod';
import { LoaderService } from './../../../services/loading-service';
import { SqlGenericService } from './../../../services/sqlGenericService';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GenericModalComponent } from '../generic-modal/generic-modal.component';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-trivia-admon',
  templateUrl: './trivia-admon.page.html',
  styleUrls: ['./trivia-admon.page.scss'],
})
export class TriviaAdmonPage implements OnInit {

  public menus: any = [
    {
      title: "Temas / Categorías",
      icon: "assignment",
      id: 1
    }, {
      title: "Preguntas Frecuentes",
      icon: "help_outline",
      id: 2
    }, {
      title: "Trivias",
      icon: "question_answer",
      id: 3
    }
  ];

  public menuActivo = 1;

  public temas: any[] = [];
  public preguntas: any[] = [];
  public trivias: any[] = [];
  public triviaObj: any = {
    idTema: null,
    idComplejidad: null,
    complejidades: []
  }

  public img: any = environment.getImagenIndividual;

  constructor(
    private menu: MenuController,
    private sqlGenericService: SqlGenericService,
    private loadingService: LoaderService,
    private matDialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.menu.enable(false);
    this.cargarTemas();
  }

  open(menu) {
    this.menuActivo = menu.id;
    switch (this.menuActivo) {
      case 1:
        this.cargarTemas();
        break;
      case 2:
        this.cargarPreguntas();
        break;
      case 3:
        this.cargarTrivias();
        this.cargarTemas();
        this.cargarComplejidad();
        break;
      default:
        break;
    }
  }

  cargarTemas() {
    if (this.menuActivo != 3) {
      this.loadingService.show("Cargando temas...");
    }
    let sql: string = `SELECT id, descripcion as label, id_archivo FROM catalogo WHERE id_tipo_catalogo = 31 AND id_empresa = ${idEmpresa}`;
    console.log(sql);

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.loadingService.hide();
      this.temas = resp.parameters;
      if (this.menuActivo == 3) {
        this.temas.unshift({
          id: null,
          label: "[--Seleccione--]"
        });
      }
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarComplejidad() {
    let sql: string = `SELECT id, descripcion as label, id_archivo FROM catalogo WHERE id_tipo_catalogo = 32 AND id_empresa = ${idEmpresa}`;
    console.log(sql);

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.loadingService.hide();
      this.triviaObj.complejidades = resp.parameters;
      this.triviaObj.complejidades.unshift({
        id: null,
        label: "[--Seleccione--]"
      });
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarPreguntas() {
    this.loadingService.show("Cargando preguntas frecuentes...");
    let sql: string = `SELECT 
    pf.*,
    t.nombre  
    FROM preguntas_frecuentes pf
    INNER JOIN catalogo t
    ON (t.id = pf.id_tema) 
    WHERE pf.id_empresa = ${idEmpresa}
    ORDER BY t.nombre ASC`;
    console.log(sql);

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.loadingService.hide();
      this.preguntas = resp.parameters;
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarTrivias() {
    this.loadingService.show("Cargando trivias...");
    let sql: string = `SELECT 
    pf.*,
    t.nombre,
    t2.nombre as complejidad 
    FROM trivia pf
    INNER JOIN catalogo t
    ON (t.id = pf.id_tema) 
    INNER JOIN catalogo t2
    ON (t2.id = pf.id_complejidad) 
    WHERE pf.id_empresa = ${idEmpresa}
    ORDER BY t.nombre ASC`;
    console.log(sql);

    this.trivias = [];
    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.loadingService.hide();
      resp.parameters.forEach(element => {
        let json: any = JSON.parse(element.json_trivia);
        this.trivias.push({
          pregunta: json.pregunta,
          complejidad: element.complejidad,
          id: element.id,
          tema: element.nombre,
          json: json,
          id_tema: element.id_tema,
          id_complejidad: element.id_complejidad,
          respuestas: json.respuestas,
          respuesta: json.respuesta
        });
      });

    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  create() {
    let data: any = {};
    data.id = this.menuActivo;
    switch (this.menuActivo) {
      case 1:
        data.status = false;
        data.id = 1;
        data.current = {
          label: "",
          b64: "",
          id_archivo: null,
          id: null
        };
        break;
      case 2:
        data.status = false;
        data.current = {
          pregunta: "",
          respuesta: "",
          id_tema: null,
          id: null
        };
        break;
      case 3:
        data.status = false;
        data.current = {
          pregunta: "",
          complejidad: null,
          id: null,
          tema: null,
          json: null,
          id_tema: null,
          id_complejidad: null,
          respuestas: [],
          respuesta: null
        };
        break;
      default:
        break;
    }
    let matDialogConfig: MatDialogConfig = { data: data, disableClose: true, panelClass: "modal-general" };
    let dialogRef = this.matDialog.open(GenericModalComponent, matDialogConfig);
    //dialogRef.
    dialogRef.beforeClosed().subscribe((r) => {
      switch (this.menuActivo) {
        case 1:
          this.cargarTemas();
          break;
        case 2:
          this.cargarPreguntas();
          break;
        case 3:
          this.cargarTrivias();
          break;
        default:
          break;
      }
    });
  }

  edit(item: any) {
    let data: any = {};
    data.id = this.menuActivo;
    switch (this.menuActivo) {
      case 1:
        let tema = item;
        data.status = true;
        data.current = {
          label: tema.label,
          b64: "",
          id_archivo: tema.id_archivo,
          id: tema.id
        };
        break;
      case 2:
        let preguntaFrecuente = item;
        data.status = true;
        data.current = {
          pregunta: preguntaFrecuente.pregunta,
          respuesta: preguntaFrecuente.respuesta,
          id_tema: preguntaFrecuente.id_tema,
          id: preguntaFrecuente.id
        };
        break;
      case 3:
        let trivia = item;
        data.status = true;
        console.log(trivia);
        
        data.current = {
          pregunta: trivia.pregunta,
          complejidad: trivia.complejidad,
          id: trivia.id,
          tema: trivia.tema,
          json: trivia.json,
          id_tema: trivia.id_tema,
          id_complejidad: trivia.id_complejidad,
          respuestas: trivia.respuestas,
          respuesta: trivia.respuesta
        }
        break;
      default:
        break;
    }

    let matDialogConfig: MatDialogConfig = { data: data, disableClose: true, panelClass: "modal-general" };
    let dialogRef = this.matDialog.open(GenericModalComponent, matDialogConfig);
    //dialogRef.
    dialogRef.beforeClosed().subscribe((r) => {
      switch (this.menuActivo) {
        case 1:
          this.cargarTemas();
          break;
        case 2:
          this.cargarPreguntas();
          break;
        case 3:
          this.cargarTrivias();
          break;
        default:
          break;
      }
    });
  }

  delete(item: any) {
    let sqlDelete: string = "";
    let data: any = {};
    switch (this.menuActivo) {
      case 1:
        let tema = item;
        sqlDelete = `DELETE FROM catalogo WHERE id = ${tema.id}`;
        data.sql = sqlDelete;
        data.msj = "Se eliminará el tema permanentemente"
        break;
      case 2:
        let pregunta = item;
        sqlDelete = `DELETE FROM preguntas_frecuentes WHERE id = ${pregunta.id}`;
        data.sql = sqlDelete;
        data.msj = "Se eliminará la pregunta frecuente permanentemente"
        break;
      case 3:
        let trivia = item;
        sqlDelete = `DELETE FROM trivia WHERE id = ${trivia.id}`;
        data.sql = sqlDelete;
        data.msj = "Se eliminará la trivia permanentemente"
        break;
      default:
        break;
    }

    this.confirm(data);

  }

  confirm(data) {
    this.alertService.confirmTrashAlert(() => {
      this.loadingService.show("Eliminando...");
      this.sqlGenericService.excecuteQueryString(data.sql).subscribe((response: any) => {
        this.loadingService.hide();
        switch (this.menuActivo) {
          case 1:
            this.cargarTemas();
            break;
          case 2:
            this.cargarPreguntas();
            break;
          case 3:
            this.cargarTrivias();
            break;
          default:
            break;
        }

      }, (error: HttpErrorResponse) => {
        this.loadingService.hide();
        this.alertService.errorAlert("Oops!", "Ocurrió un error, contacta al administrador");
      });
    }, "Confirmar", data.msj, "Aceptar");
  }

}
