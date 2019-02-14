import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class AuthService implements CanActivate {


    constructor(
        private user: UserService,
        private router: Router
    ) {
    }

    async canActivate(route){
        if(await this.user.isAuthenticated()){
            //this is ok
            return true;
        } else {
            this.router.navigate[('/login')];
            return false;
        }
    }
}
