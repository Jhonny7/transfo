import { GenericService } from 'src/app/services/generic.service';
import { SqlGenericService } from 'src/app/services/sqlGenericService';
import { Component, OnInit } from '@angular/core';
import { idEmpresa } from 'src/environments/environment.prod';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sabias',
  templateUrl: './sabias.page.html',
  styleUrls: ['./sabias.page.scss'],
})
export class SabiasPage implements OnInit {

  public imgsBanner: any[] = [];
  public temas: any[] = [];
  public temaSelect:any = null;
  public

  constructor(
    private sqlGenericService: SqlGenericService,
    public genericService: GenericService
  ) { }

  ngOnInit() {
    this.cargarTemas();
  }

  cargarSabias(item:any) {

  }

  cargarTemas() {
    let sql: string = `SELECT id, descripcion as label, id_archivo FROM catalogo WHERE id_tipo_catalogo = 31 AND id_empresa = ${idEmpresa}`;

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.temas = resp.parameters;
    }, (err: HttpErrorResponse) => {
    });
  }

}
