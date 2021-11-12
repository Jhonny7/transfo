//import { TranslateService } from '@ngx-translate/core';
import { Injectable, HostListener } from "@angular/core";
import swal, { SweetAlertOptions } from "sweetalert2";
import { PlatformLocation } from '@angular/common';

@Injectable({
  providedIn: "root"
})
export class AlertService {

  constructor(
    private location: PlatformLocation,) {
    location.onPopState(() => {
      swal.close();
    });
  }

  customizeAlert(data: any, accion: any = null) {
    swal.fire(data).then(result => {
      if (result.value) {
        if (accion) {
          accion();
        }
      }
    });
  }

  warnAlert(titulo: string, mensaje: string, accion: any = null) {
    let dataAlert: any = {
      type: null,
      title: null,
      text: null,
      confirmButtonText: "Aceptar",
      showCancelButton: false,
      showCloseButton: true,
      allowOutsideClick: false,
      customClass: "alerta-vista-warn"
    };

    dataAlert.html = `
          
          <div class="contenedor-imagen warn-a"> 
          </div>
    
          <div class="mensaje">
            <p>${titulo}</p>
          </div>
    
          <div class="descripcion">
            <p>${mensaje}</p>
          </div>
          `;
    dataAlert.funcion = () => { };

    swal.fire(dataAlert).then(result => {
      if (result.value) {
        if (accion) {
          accion();
        }
      }
    });
  }

  errorAlert(titulo: string, mensaje: string, accion: any = null) {
    let dataAlert: any = {
      type: null,
      title: null,
      text: null,
      confirmButtonText: "Aceptar",
      showCancelButton: false,
      showCloseButton: true,
      allowOutsideClick: false,
      customClass: "alerta-vista-error"
    };

    dataAlert.html = `
          
          <div class="contenedor-imagen error-a"> 
          </div>
    
          <div class="mensaje">
            <p>${titulo}</p>
          </div>
    
          <div class="descripcion">
            <p>${mensaje}</p>
          </div>
          `;
    dataAlert.funcion = () => { };

    swal.fire(dataAlert).then(result => {
      if (result.value) {
        if (accion) {
          accion();
        }
      }
    });
  }

  successAlert(titulo: string, mensaje: string, accion: any = null, cssClass: string = "alerta-vista") {
    let dataAlert: any = {
      type: null,
      title: null,
      text: null,
      confirmButtonText: "Aceptar",
      showCancelButton: false,
      showCloseButton: true,
      allowOutsideClick: false,
      customClass: cssClass
    };

    dataAlert.html = `
          
          <div class="contenedor-imagen success-a"> 
          </div>
    
          <div class="mensaje">
            <p>${titulo}</p>
          </div>
    
          <div class="descripcion">
            <p>${mensaje}</p>
          </div>
          `;
    dataAlert.funcion = () => { };

    swal.fire(dataAlert).then(result => {
      if (result.value) {
        if (accion) {
          accion();
        }
      }
    });
  }

  confirmTrashAlert(accion: any = null, titulo: string = "", mensaje: string = "", buttonTitle: string = "", cssClass: string = "alerta-vista") {
    let dataAlert: any = {
      type: null,
      title: null,
      text: null,
      confirmButtonText: buttonTitle,
      showCancelButton: true,
      showCloseButton: true,
      allowOutsideClick: false,
      customClass: `${cssClass} trash`
    };

    dataAlert.html = `
          
          <div class="contenedor-imagen trash-a"> 
          </div>
    
          <div class="mensaje">
            <p>${titulo}</p>
          </div>
    
          <div class="descripcion">
            <p>${mensaje}</p>
          </div>
          `;
    dataAlert.funcion = () => { };

    swal.fire(dataAlert).then(result => {
      if (result.value) {
        if (accion) {
          accion();
        }
      }
    });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    ////console.log("back?");

    swal.close();
  }
}
