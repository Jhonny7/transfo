import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { FCM } from '@ionic-native/fcm/ngx';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { emulado } from './../environments/environment.prod';
import { Menu } from './interfaces/menu.interface';
import { FcmService } from './services/fcm.service';
import { LoaderService } from './services/loading-service';
import { LocalStorageEncryptService } from './services/local-storage-encrypt.service';
import { SqlGenericService } from './services/sqlGenericService';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  public menus: Menu[] = [{
    name: "menu.home",
    url: "/home",
    icon: "assets/imgs/logo-sup.png",
    active: true
  }, {
    name: "menu.news",
    url: "/noticia",
    icon: "assets/imgs/menu/periodico.png",
    active: false
  }, {
    name: "menu.product",
    url: "/producto",
    icon: "assets/imgs/menu/proteina.png",
    active: false
  }];

  constructor(
    private localStorageEncryptService: LocalStorageEncryptService,
    private translateService: TranslateService,
    private router: Router,
    private menu: MenuController,
    //private fcm: FCM,
    
    private loadingService: LoaderService,
    private sqlGenericService: SqlGenericService,
    private fcmService: FcmService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(){
    this.cargaIdioma();
    this.cargarTema();

    if (!emulado) {
      this.registerToken();
    } else {
      this.registerTokenFake();
    }
  }

  registerToken() {
    let registerToken: any = this.localStorageEncryptService.getFromLocalStorage("token-gym");
    if (!registerToken) {
      this.fcmService.initPush();
    }else{
      //this.listenNotifications();
      this.fcmService.listenNotifications();
    }
  }

  registerTokenFake() {
    let registerToken: any = this.localStorageEncryptService.getFromLocalStorage("token-gym");
    if (!registerToken) {
        //token is token of device
        let uuid: any = "fakeUuidGym";
        let token:string = "fakeTokenGym";
        let sql: string = `INSERT INTO usuario (uuid, token) VALUES ('${uuid}', '${token}')`;
        let sqlChecking: string = `SELECT * FROM usuario WHERE uuid = '${uuid}'`;

        this.loadingService.show();

        //consultar uuid en base de datos antes de registrar nuevo token 
        //Si encuentra el uuid se actualizará el token pero no creará nuevo usuario

        this.sqlGenericService.excecuteQueryString(sqlChecking).subscribe((resp: any) => {
         //console.log(resp);
          
          if (resp.parameters.length <= 0) {
            this.sqlGenericService.excecuteQueryString(sql, 3).subscribe((resp: any) => {
              //Se registra correctamente nuevo usuario
              this.loadingService.hide();
              this.localStorageEncryptService.setToLocalStorage("token-gym", token);
              //this.fcm.subscribeToTopic('myGymGlobal');//se suscribe a notificaciones globales de la app
              //this.listenNotifications();
            }, (err: HttpErrorResponse) => {
              this.loadingService.hide();
            });
          }else{
            this.loadingService.hide();
          }
        }, (err: HttpErrorResponse) => {
          this.loadingService.hide();
        });
    }else{
      this.listenNotifications();
    }
  }

  listenNotifications(){
    /* this.fcm.onNotification().subscribe(data => {
     //console.log(data);
      if(data.wasTapped){
       //console.log("Received in background");
      } else {
       //console.log("Received in foreground");
      };
    }); */
  }

  cargarTema() {
    let t: any = this.localStorageEncryptService.getFromLocalStorage("theme");
    if (!t) {
      this.localStorageEncryptService.setToLocalStorage("theme", "#0783bc");
      this.localStorageEncryptService.setToLocalStorage("color-font", "#fff");
      this.localStorageEncryptService.setToLocalStorage("themeClass", "primary");
      //this.localStorageEncryptService.setToLocalStorage("primary", "#232323");
    }
  }

  cargaIdioma() {
    let l: any = this.localStorageEncryptService.getFromLocalStorage("language");
    if (l) {
      this.translateService.setDefaultLang(l);
      this.translateService.use(l);
    } else {
      this.localStorageEncryptService.setToLocalStorage("language", "en");
      this.translateService.setDefaultLang("en");
      this.translateService.use("en");
    }
  }

  openPage(itm: Menu) {
    this.menus.forEach((itm: Menu) => {
      itm.active = false;
    });

    itm.active = true;
    this.router.navigate([itm.url], { replaceUrl: true });

  }
}