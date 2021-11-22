import { HttpErrorResponse } from '@angular/common/http';
import { LocalStorageEncryptService } from './../../../services/local-storage-encrypt.service';
import { LoaderService } from 'src/app/services/loading-service';
import { Component, OnInit } from '@angular/core';
import { title } from 'process';
import { GenericService } from 'src/app/services/generic.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SqlGenericService } from 'src/app/services/sqlGenericService';
import { environment, idEmpresa } from 'src/environments/environment.prod';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  viewCapsulas: boolean = false;
  viewMaterias: boolean = false;
  viewCapsulasList: boolean = false;
  listMaterias: Array<string>;
  capsulasInfo;
  title: any;
  titleCapsula: any;
  descripcion: any;
  video: any;
  url = environment.getImagenIndividual;
  constructor(
    private loadingService: LoaderService,
    private sqlGenericService: SqlGenericService,
    private genericService: GenericService,
    private localStorageEncryptService: LocalStorageEncryptService
  ) { }
  ngOnInit() {
    this.getMaterias();

    /*
    $asunto = $data['asunto'];
    $cuerpo = $data['cuerpo'];
    $from = $data['from'];
    $to = $data['to'];

    $name = $data['name'];
    */

    let epoch = Date.now();

    //insertar en usuario contrasegnia
    let sql:string = `INSERT INTO `;

    let request: any = {
      asunto: "Recuperar Contrasenia",
      from: "sarrejuan@gmail.com",
      name: "sarrejuan@gmail.com",
      to: "sarrejuan@gmail.com",
      cuerpo: `<section>
      <div style="background-color: #006b89;
      text-align: center;padding: 8px;">
        <p style="color: #fff;margin: 0;font-size: 20px;">Este correo es enviado por TRANSFO</p>
      </div>
      <div style="padding: 10px;border: 1px solid #c8c8c8;">
        <p style="color: #000;">Hola jhonny, olvidaste tu contraseña?</p>
        <p style="color: #000;">Nosotros te enviamos este correo para que puedas reestablecerla, solo da clic en el
          botón
          y sigue las instrucciones
        </p>

        <a href=""><button style="color: #fff;
          background-color: #006b89;
          font-size: 16px;
          padding: 8px;
          border-radius: 8px;
          box-shadow: 1px 1px 1px #123;
          margin-bottom: 20px;
          min-width: 200px;
          cursor: pointer;">Recuperar</button></a>

        <p style="color: #000;">O si lo prefieres puedes hacer click en el siguiente enlace</p>
      </div>
    </section>`
    };
    this.genericService.sendPostRequest(environment.mail, request).subscribe((response: any) => {

    }, (error: HttpErrorResponse) => {

    });
  }

  getMaterias() {
    this.loadingService.show('Espere...');

    const sql = `SELECT id AS value, descripcion as label, id_archivo FROM catalogo WHERE id_tipo_catalogo = 31 AND id_empresa = ${idEmpresa}`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      console.log(response.parameters);
      this.listMaterias = response.parameters;
      this.loadingService.hide();
      let temaID: any = this.localStorageEncryptService.getFromLocalStorage("temaGlobal");
      let position = this.listMaterias.findIndex((o: any) => {
        return o.id == temaID;
      });

      let t = this.listMaterias[position];
      this.getCapsulasList(t);
    });
  }

  getCapsulasList(item) {
    this.title = item.label;
    this.loadingService.show('Espere...');
    const sql = `SELECT * FROM capsula WHERE id_empresa = ${idEmpresa} AND id_tema = ${item.value}`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      console.log(response.parameters);
      this.capsulasInfo = response.parameters;
      this.loadingService.hide();
    });
    this.viewCapsulasList = true;
    this.viewMaterias = false;
    this.viewCapsulas = false;
  }

  getCapsulas(item) {
    this.titleCapsula = item.nombre;
    this.video = item.id_archivo;
    this.descripcion = item.descripcion;
    this.viewCapsulasList = false;
    this.viewMaterias = false;
    this.viewCapsulas = true;
  }
}
