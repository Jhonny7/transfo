import { SqlGenericService } from './../../services/sqlGenericService';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertService } from './../../services/alert.service';
import { LoaderService } from './../../services/loading-service';
import { Plugins } from '@capacitor/core';
import { Router, NavigationExtras } from '@angular/router';
/* import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app'; */
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
//import firebase from 'firebase'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  public visto: boolean = false;

  public data: any = {
    email: {
      error: false,
      value: ""
    },
    pass: {
      error: false,
      value: ""
    }
  };

  constructor(
    private alertService: AlertService,
    private loadingService: LoaderService,
    public router: Router,
    //private afAuth: AngularFireAuth,
    private platform: Platform,
    private googlePlus: GooglePlus,
    private sqlGenericService: SqlGenericService
  ) {
  }



  ngOnInit() {
    setTimeout(() => {
      let objDiv = document.getElementById("btn-scroll");
      objDiv.scrollTop = objDiv.scrollHeight;
    }, 500);
    //this.getCurrentState();
  }

  async getCurrentState() {
    const result = await Plugins.FacebookLogin.getCurrentAccessToken();
    try {
     //console.log("Facebook current");

     //console.log(result);
      if (result && result.accessToken) {
        let user = { token: result.accessToken.token, userId: result.accessToken.userId }
        let navigationExtras: NavigationExtras = {
          queryParams: {
            userinfo: JSON.stringify(user)
          }
        };
        //Redireccion to home si tiene login facebook
        //this.router.navigate(["/home"], navigationExtras);
      }
    } catch (e) {
     //console.log(e)
    }
  }

  async signIn(): Promise<void> {
   //console.log("LOGGIN FACEBOOK_");

    const FACEBOOK_PERMISSIONS = ['public_profile', 'email'];

    const result = await Plugins.FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    if (result && result.accessToken) {
      let user = { token: result.accessToken.token, userId: result.accessToken.userId, data: result };

      let navigationExtras: NavigationExtras = {
        queryParams: {
          userinfo: JSON.stringify(user)
        }
      };

      /*
      imagen: https://graph.facebook.com/${id}/picture?type=large&redirect=true&width=500&height=500
      fields: https://graph.facebook.com/${id}?fields=id,name,email&access_token=${token}
      */
     //console.log("USER FACEBOOK_");
     //console.log(JSON.stringify(user));

      //this.router.navigate(["/home"], navigationExtras);
    }
  }

  loginGoogle() {
    /* if (this.platform.is('android')) {
     //console.log("IN ANDROID");

      this.loginGoogleAndroid();
    } else {
      this.loginGoogleWeb();
    } */
  }

  /* async loginGoogleAndroid() {
    const res = await this.googlePlus.login({
      'webClientId': "207458345350-s4f0poahnfj28ea1e1nnv3enrlgv96nl.apps.googleusercontent.com",
      'offline': true
    });
    const resConfirmed = await this.afAuth.signInWithCredential(firebase.default.auth.GoogleAuthProvider.credential(res.idToken));
    const user = resConfirmed.user;
   //console.log("google user____");
   //console.log(user);


  }

  async loginGoogleWeb() {
    let f: any = firebase;
    const res = await this.afAuth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider());
    const user = res.user;
   //console.log(user);
  } */

  change() {
    let id: any = document.getElementById("input-pass3");
    if (id.type == "text") {
      id.type = "password";
    } else {
      id.type = "text";
    }
  }

  login() {
    this.loadingService.show("Espere...");
    let sql: string = `SELECT * FROM usuario WHERE password = SHA2(MD5(UNHEX(SHA2('${this.data.pass.value}',512))),224) AND username = '${this.data.email.value}'`;
      this.sqlGenericService.excecuteQueryString(sql).subscribe((response: any) => {
        this.loadingService.hide();
        localStorage.setItem("userSessionEducacion", JSON.stringify(response.parameters[0]));
        this.router.navigate(["/","home"]);
      },(error: HttpErrorResponse)=>{
        this.loadingService.hide();
        this.alertService.errorAlert("Oops", `Verifica usuario y/o contraseña`);
      });
  }
}
