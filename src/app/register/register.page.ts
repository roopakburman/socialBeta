import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { UserService } from '../user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  username: string="";
  password: string="";
  cpassword: string="";
  constructor(
    public afAuth: AngularFireAuth,
    public alerts: AlertController,
    public router: Router,
    public afStore: AngularFirestore,
    public user: UserService
    ) { }

  ngOnInit() {
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

  async register(){
    const {username, password, cpassword} = this;

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
      this.showAlert("CONGRATULATIONS", "Your account has been created!");
      this.router.navigate(['/tabs']);
    
    
    } catch(err){
      console.dir(err);
      this.showAlert("Oops! Something is not right!", err.message);
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
}
