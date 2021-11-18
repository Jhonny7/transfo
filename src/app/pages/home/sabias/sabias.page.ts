import { LocalStorageEncryptService } from './../../../services/local-storage-encrypt.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from './../../../services/loading-service';
import { GenericService } from 'src/app/services/generic.service';
import { SqlGenericService } from 'src/app/services/sqlGenericService';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { idEmpresa } from 'src/environments/environment.prod';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sabias',
  templateUrl: './sabias.page.html',
  styleUrls: ['./sabias.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SabiasPage implements OnInit {

  public imgsBanner: any[] = [];
  public temas: any[] = [];
  public sabias: any[] = [];
  public temaSelect: any = null;
  public sabiasSelect: any = null;
  public step: number = 2;

  constructor(
    private sqlGenericService: SqlGenericService,
    public genericService: GenericService,
    private loadingService: LoaderService,
    private domSanitizer: DomSanitizer,
    private localStorageEncryptService: LocalStorageEncryptService
  ) { }

  ngOnInit() {
    this.cargarTemas();
  }

  cargarSabias(item: any) {
    let temaID: any = this.localStorageEncryptService.getFromLocalStorage("temaGlobal");

    let sql: string = `SELECT * FROM catalogo WHERE id_tema = ${Number(temaID)} AND id_empresa = ${idEmpresa}`;
    this.loadingService.show("Espere...");
    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.sabias = resp.parameters;
      this.step = 2;
      this.loadingService.hide();


    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarSabiaUnico(item: any) {
    this.sabiasSelect = item;
    this.sabiasSelect.d2 = this.domSanitizer.bypassSecurityTrustHtml(this.sabiasSelect.descripcion);
    let sql: string = `SELECT * FROM catalogo WHERE id_referencia = ${item.id}`;
    this.loadingService.show("Espere...");
    this.imgsBanner = [];
    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      resp.parameters.forEach(element => {
        this.imgsBanner.push({
          name: element.nombre,
          description: element.descripcion,
          buttonText: "Entrar",
          image: element.id_archivo
        });
      });

      this.step = 3;
      this.loadingService.hide();
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  cargarTemas() {
    this.loadingService.show("Buscando información");
    let sql: string = `SELECT id, descripcion as label, id_archivo FROM catalogo WHERE id_tipo_catalogo = 31 AND id_empresa = ${idEmpresa}`;
    let temaID: any = this.localStorageEncryptService.getFromLocalStorage("temaGlobal");
    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.temas = resp.parameters;

      let position = this.temas.findIndex((o) => {
        return o.id == temaID;
      });

      this.temaSelect = this.temas[position];
      this.loadingService.hide();
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

}
