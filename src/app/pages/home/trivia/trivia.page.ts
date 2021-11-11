import { LocalStorageEncryptService } from './../../../services/local-storage-encrypt.service';
import { SqlGenericService } from 'src/app/services/sqlGenericService';
import { AlertService } from 'src/app/services/alert.service';
import { LoaderService } from 'src/app/services/loading-service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.page.html',
  styleUrls: ['./trivia.page.scss'],
})
export class TriviaPage implements OnInit {

  public user: any = null;
  public triviaActual: any[] = [];

  public data: any = {
    step: 1,
    preguntaActual: 0,
    almacenRespuestas: []
  };

  public tiempo: number = 5;
  public intervalo: any;

  constructor(
    private loadingService: LoaderService,
    private alertService: AlertService,
    private sqlGenericService: SqlGenericService,
    private localStorageEncryptService: LocalStorageEncryptService
  ) {
    this.user = this.localStorageEncryptService.getFromLocalStorage("userSessionEducacion");
  }

  ngOnInit() {
    //this.loadingService.show("Verificando tu nivel actual");
    if (!this.user.id_nivel) {
      this.cargarNivel();
    } else {
      this.cargarTrivia();
    }
  }

  cargarTrivia() {
    let sql: string = `SELECT 
    t.* 
    FROM trivia t 
    LEFT JOIN usuario_pregunta up
    ON (up.id_pregunta = t.id) 
    WHERE 
    up.id_pregunta IS NULL AND
    t.id_complejidad = (SELECT id_referencia FROM catalogo WHERE id = ${this.user.id_nivel})
    ORDER BY RAND()
    LIMIT 5`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      response.parameters.forEach(element => {
        let json: any = JSON.parse(element.json_trivia);
        this.triviaActual.push({
          ...element,
          json
        });
      });

      console.log(this.triviaActual);

    }, (error: HttpErrorResponse) => {
      this.alertService.errorAlert("Oops", `Ocurió un error, intenta nuevamente`);
    });
  }

  cargarNivel() {
    this.loadingService.show("Verificando tu nivel actual");
    let sql: string = `UPDATE usuario SET id_nivel = (SELECT id FROM catalogo WHERE id_referencia = 140)`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      this.loadingService.hide();

      let sqlUser: string = `SELECT * FROM usuario WHERE id = ${this.user.id}`;
      this.sqlGenericService.excecuteQueryString(sqlUser).subscribe((response: any) => {
        this.user = response.parameters[0];
        this.cargarTrivia();
        this.localStorageEncryptService.setToLocalStorage("userSessionEducacion", this.user);
      }, (error: HttpErrorResponse) => {
        this.alertService.errorAlert("Oops", `Ocurió un error, intenta nuevamente`);
      });

    }, (error: HttpErrorResponse) => {
      this.loadingService.hide();
      this.alertService.errorAlert("Oops", `Ocurió un error, intenta nuevamente`);
    });
  }

  empezar() {
    this.data.step = 2;
    this.intervalear();
  }

  intervalear() {
    this.intervalo = setInterval(() => {
      this.tiempo--;
      if (this.tiempo == 0) {
        clearInterval(this.intervalo);
        this.evalua({ id: -1 });//respuesta erronea default
      }
    }, 1000);
  }

  evalua(respuestaSeleccionada: any) {
    if (this.triviaActual[this.data.preguntaActual]) {
      this.data.almacenRespuestas.push({
        seleccion: respuestaSeleccionada.id,
        correcta: this.triviaActual[this.data.preguntaActual].json.respuesta,
        idTrivia: this.triviaActual[this.data.preguntaActual].id,
        pregunta: this.triviaActual[this.data.preguntaActual].json.pregunta,
        isFine: this.triviaActual[this.data.preguntaActual].json.respuesta == respuestaSeleccionada.id
      });
      this.data.preguntaActual++;
      if (this.data.preguntaActual <= this.triviaActual.length - 1) {
        this.tiempo = 5;
        clearInterval(this.intervalo);
        this.intervalear();
      }else{
        console.log("Terminamos");
        
      }
    } else {
      console.log("termina trivia");

    }
  }

}
