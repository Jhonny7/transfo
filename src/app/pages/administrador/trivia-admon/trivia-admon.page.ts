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
    }
  ];

  public menuActivo = 1;

  public temas: any[] = [];

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

  open(menu){
    this.menuActivo = menu.id;
    switch (this.menuActivo) {
      case 1:
        this.cargarTemas();
        break;
    
      default:
        break;
    }
  }

  cargarTemas() {
    this.loadingService.show("Cargando temas...");
    let sql: string = `SELECT id, descripcion as label, id_archivo FROM catalogo WHERE id_tipo_catalogo = 31 AND id_empresa = ${idEmpresa}`;
    console.log(sql);

    this.sqlGenericService.excecuteQueryString(sql).subscribe((resp: any) => {
      //Se registra correctamente nuevo usuario
      this.loadingService.hide();
      this.temas = resp.parameters;
    }, (err: HttpErrorResponse) => {
      this.loadingService.hide();
    });
  }

  create() {
    let data: any = {};
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

        default:
          break;
      }
    });
  }

  delete(item:any){
    let sqlDelete:string = "";
    let data:any = {};
    switch (this.menuActivo) {
      case 1:
        let tema = item;
        sqlDelete = `DELETE FROM catalogo WHERE id = ${tema.id}`;
        data.sql = sqlDelete;
        data.msj = "Se eliminará el tema permanentemente"
        break;
    
      default:
        break;
    }

    this.confirm(data);

  }

  confirm(data){
    this.alertService.confirmTrashAlert(()=>{
      this.loadingService.show("Eliminando...");
      this.sqlGenericService.excecuteQueryString(data.sql).subscribe((response: any) => {
        this.loadingService.hide();
        switch (this.menuActivo) {
          case 1:
            this.cargarTemas();
            break;
          default:
            break;
        }
        
      }, (error: HttpErrorResponse) => {
        this.loadingService.hide();
        this.alertService.errorAlert("Oops!", "El tema esta asignado, contacta al administrador");
      });
    },"Confirmar", data.msj, "Aceptar");
  }

}
