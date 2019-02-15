import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { auth } from 'firebase/app';



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
    ) {

    }

    setUser(user: user) {
        this.user = user;
    }

    getUserName(): string {
        return this.user.username;
    }

    async isAuthenticated() {
        if (this.user) return true;

        const user = await this.afAuth.authState.pipe(first()).toPromise();

        if (user) {
            this.setUser({
                username: user.email,
                uid: user.uid
            });
            return true;
        }
        return false;
    }

    getUid(): string {
        return this.user.uid;
    }

    reAuth(username: string, password: string){
        return this.afAuth.auth.currentUser.reauthenticateWithCredential(auth.EmailAuthProvider.credential(username, password));
    }
    updatePassword(newPassword: string){
        return this.afAuth.auth.currentUser.updatePassword(newPassword);
    }

    updateEmail(newEmail: string){
        return this.afAuth.auth.currentUser.updateEmail(newEmail);
    }

    // logOut(){
    //     return this.afAuth.auth.currentUser.
    // }
}

