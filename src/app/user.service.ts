import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';

interface user {
    username: string,
    uid: string
}

@Injectable()
export class UserService {
    private user: user

    constructor(
        private afAuth: AngularFireAuth,
        public router: Router
    ){

    }

    setUser(user: user){
        this.user = user;
    }

    getUid() {
        if(!this.user){
            if(this.afAuth.auth.currentUser){
                const user = this.afAuth.auth.currentUser;
                
                this.setUser({
                    username: user.email,
                    uid: user.uid

                })
                return user.uid;
            }else {
                console.log('user not logged in!');
                this.router.navigate[('/login')];
            }
        }else {
            return this.user.uid;
        }
    }
}


// username: user.email.split('@')[0],
        // if(!this.user){
        //     if(this.afAuth.auth.currentUser){
        //         const user = this.afAuth.auth.currentUser;
                
        //         this.setUser({
        //             username: user.email,
        //             uid: user.uid

        //         })
        //         return user.uid;
        //     }else {
        //         console.log('user not logged in!');
        //         this.router.navigate[('/login')];
        //     }
        // }else {
        //     return this.user.uid;
        // }