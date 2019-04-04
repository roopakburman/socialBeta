import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from "rxjs";
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AlertController, Platform, LoadingController } from "@ionic/angular";
import * as firebase from 'firebase';
import { async } from 'rxjs/internal/scheduler/async';
import { environment } from "../environments/environment";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { AngularFirestore } from "@angular/fire/firestore";
@Injectable()
export class AuthService implements CanActivate {


    constructor(
        private user: UserService,
        public afAuth: AngularFireAuth,
        public alerts: AlertController,
        private router: Router,
        private platform: Platform,
        public afStore: AngularFirestore,
        public loadingController: LoadingController,
        public alertController: AlertController,
        public nativeStorage: NativeStorage,
        public googlePlus: GooglePlus
        
    ) {}

    

    async canActivate(route){
        if(await this.user.isAuthenticated()){
            //this is ok
            return true;
        } else {
            // this.router.navigate[('/login')];
            return false;
        }
    }
    // **********************************************************
    // ****************** FIREBASE EMAIL AUTH *******************
    // **********************************************************
    async login(username, password){
      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
      this.presentLoading(loading);
        try {
          const res = await this.afAuth.auth.signInWithEmailAndPassword(username, password);
          
          if(res.user) {
            this.user.setUser({
              username,
              uid: res.user.uid
            })
            this.router.navigate(['/tabs']);
            loading.dismiss();

            this.welcomUserAlert();
          }
        
        } catch(err){
          console.dir(err);
          loading.dismiss();
        }
    
      }
      logoutFirebase(){
        this.afAuth.auth.signOut();
      }

      async welcomUserAlert() {
        const alert = await this.alertController.create({
           message: 'Welcome to Social Beta!',
           buttons: ['OK']
         });
    
        await alert.present();
      }

      // **************************************************************
      // ****************** FIREBASE EMAIL REGISTER *******************
      // **************************************************************
      async registerWithFirebase(username, password, cpassword){
        const loading = await this.loadingController.create({
          message: 'Please wait...'
        });
        this.presentLoading(loading);
    
        if(password !== cpassword) {
          this.showAlert("Error", "Password don't Match!");
          return console.log("Passwords don't match");
        }
    
        try {
          const res = await this.afAuth.auth.createUserWithEmailAndPassword(username, password);
          // console.dir(res);
    
          this.afStore.doc(`users/${res.user.uid}`).set({
            username
          })
    
          this.user.setUser({
            username,
            uid: res.user.uid
          })
          this.showAlert("CONGRATULATIONS", "Your account has been created! Welcome to Social Beta");
          this.router.navigate(['/tabs']);
          loading.dismiss();
        
        } catch(err){
          console.dir(err);
          loading.dismiss();
          this.showAlert(err.message, "Please be careful in typing your details.");
        }
    
      }
      async showAlert(header: string, message: string){
        const alert = await this.alerts.create({
          header,
          message,
          buttons: ['OK']
        });
        await alert.present();
      }

      // **********************************************************
      // ********************** GOOGLE AUTH ***********************
      // **********************************************************
  googleLogin() {
    if (this.platform.is('cordova')) {
      this.doGoogleLogin();
    } else {
      // this.webGoogleLogin();
    }
  }





  async doGoogleLogin(){
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    this.googlePlus.login({
      'scopes': '', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': environment.googleWebClientId, // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      })
      .then(user => {
        //save user data on the native storage
        this.nativeStorage.setItem('google_user', {
          name: user.displayName,
          email: user.email,
          picture: user.imageUrl
        })
        .then(() => {
           this.router.navigate(["/tabs"]);
        }, (error) => {
          console.log(error);
        })
        loading.dismiss();
      }, err => {
        console.log(err);
        if(!this.platform.is('cordova')){
          this.presentAlert();
        }
        loading.dismiss();
      })
  }
  // async webGoogleLogin(): Promise<void> {
  //   try {
  //     const provider = new firebase.auth.GoogleAuthProvider();
  //     const credential = await this.afAuth.auth.signInWithPopup(provider);
  
  //   } catch(err) {
  //     console.log(err)
  //   }
  
  // }

  async presentAlert() {
    const alert = await this.alertController.create({
       message: 'Cordova is not available on desktop. Please try this in a real device or in an emulator.',
       buttons: ['OK']
     });

    await alert.present();
  }


  async presentLoading(loading) {
    return await loading.present();
  }
}
