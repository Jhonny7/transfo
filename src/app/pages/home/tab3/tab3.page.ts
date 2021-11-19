import { LocalStorageEncryptService } from './../../../services/local-storage-encrypt.service';
import { LoaderService } from 'src/app/services/loading-service';
import { Component, OnInit } from '@angular/core';
import { title } from 'process';
import { GenericService } from 'src/app/services/generic.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SqlGenericService } from 'src/app/services/sqlGenericService';
import { environment, idEmpresa } from 'src/environments/environment.prod';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  viewCapsulas: boolean = false;
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
    private localStorageEncryptService: LocalStorageEncryptService,
    private router: Route,
  ) { }
  ngOnInit() {
    this.getMaterias();
  }

  getMaterias() {
    this.loadingService.show('Espere...');
    
    const sql = `SELECT id AS value, descripcion as label, id_archivo FROM catalogo WHERE id_tipo_catalogo = 31 AND id_empresa = ${idEmpresa}`;
    this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
      console.log(response.parameters);
      this.listMaterias = response.parameters;
      this.loadingService.hide();
      let temaID: any = this.localStorageEncryptService.getFromLocalStorage("temaGlobal");
      console.log(temaID);
      
      let position = this.listMaterias.findIndex((o:any) => {
        return o.value == temaID;
      });
      console.log(position);
      

      let t = this.listMaterias[position];
      console.log(t);
      
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
    this.viewCapsulas = false;
  }

  getCapsulas(item) {
    this.titleCapsula = item.nombre;
    this.video = item.id_archivo;
    this.descripcion = item.descripcion;
    this.viewCapsulasList = false;
    this.viewCapsulas = true;
  }
  return(){
    window.history.back();
  } 
}
