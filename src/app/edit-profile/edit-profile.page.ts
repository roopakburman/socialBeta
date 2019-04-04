import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
// import { http } from 'selenium-webdriver/http'


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  mainUser: AngularFirestoreDocument;
  sub;
  username: string;
  profilePic: string;

  newPassword: string;
  oldPassword: string;

  busy: boolean = false;

  @ViewChild('fileBtn') fileBtn: {
    nativeElement: HTMLInputElement;
  }
  constructor(
    private http: Http, 
    private afs: AngularFirestore,
    private alert: AlertController,
    private router: Router,
    private user: UserService
    ) {
        this.mainUser = afs.doc(`users/${user.getUid()}`);
        this.sub = this.mainUser.valueChanges().subscribe(event => {
          this.username = event.username;
          this.profilePic = event.profilePic;
        })
   }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub.unsubscribe();
  }

  updateProfile(){
    this.fileBtn.nativeElement.click();
    
  }
  uploadPic(event){
    // this.busy = true;
    
    this.updateProfile
    const files = event.target.files;

    const data = new FormData;
    data.append('file', files[0]);
    data.append('UPLOADCARE_STORE', '1');
    data.append('UPLOADCARE_PUB_KEY', '5dee6ad79fc8971ae0a0');

    this.http.post('https://upload.uploadcare.com/base/', data)
      .subscribe(event => {
        // console.log(event);
        const uuid = event.json().file;
        this.mainUser.update({
          profilePic: uuid
        })
      })

      // this.presentAlert('SUCCESS', 'Profile Pic Updated!');
      // this.busy = false;
  }
  async presentAlert(title: string, content: string){
    const alert= await this.alert.create({
      header: title,
      message: content,
      buttons: ['Sure!']
    })
  }
  async updateDetails(){
    this.busy = true

    if(!this.oldPassword) {
      this.busy = false;
      return this.presentAlert('Error!', 'You have to enter a password');
    }

    try {
      await this.user.reAuth(this.user.getUserName(), this.oldPassword);
    } catch(error){
      this.busy = false;
      return this.presentAlert('Error', 'Incorrect Password. Try Again!');
    }
    
    
    if(this.newPassword){
      await this.user.updatePassword(this.newPassword);
    }

    if(this.username !== this.user.getUserName()){
      await this.user.updateEmail(this.username); 
      this.mainUser.update({
        username: this.username
      })
    }

    this.newPassword = "";
    this.oldPassword = "";
    this.busy = false;

    await this.presentAlert('Profile updated', 'Your profile information was successfully updated on our servers. Yayyy!!!');

    this.router.navigate(['/tabs/profile']);
  }
}
