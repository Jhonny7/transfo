import { Inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable(
    {
        providedIn: "root"
    }
)
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,

    ) {

    }

    canActivateChild() {
        return this.check();
    }

    canActivate() {
        return this.check();
    }

    check() {
        let userSessionEducacion: any = JSON.parse(localStorage.getItem("userSessionEducacion"));
        let expiredSession: any = JSON.parse(localStorage.getItem("expiredSession"));
        if (userSessionEducacion) {
            return true;
        } else if (expiredSession) {
            return new Date(expiredSession) > new Date();//Solo aplica a invitados
        } else {
            return this.router.navigate(["/","login"]);
        }
    }

}