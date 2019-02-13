import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from "@ionic/angular";
import { Router } from '@angular/router';


@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {

  imageURL: string;
  desc: string;

  @ViewChild('fileUpload') fileUpload;
  constructor(
    public http: Http,
    public afStore: AngularFirestore,
    public user: UserService,
    public alerts: AlertController,
    public router: Router
  ) { }

  ngOnInit() {
  }


  createPost(){
    const image = this.imageURL;
    const desc = this.desc;

    this.afStore.doc(`users/${this.user.getUid()}`).update({
      posts: firestore.FieldValue.arrayUnion({
        image,
        desc
      })
    })
    this.showAlert('Success', 'Your Post Created');
    this.router.navigate[('/feed')];

  }

  // uploadFile(){
  //   this.fileUpload.nativeElement.click();

  // }

  fileChanged(event){
    const files = event.target.files;
    console.log(files);

    const data = new FormData;
    data.append('file', files[0]);
    data.append('UPLOADCARE_STORE', '1');
    data.append('UPLOADCARE_PUB_KEY', '5dee6ad79fc8971ae0a0');

    this.http.post('https://upload.uploadcare.com/base/',data)
    .subscribe(event => {
      console.log(event);
      this.imageURL = event.json().file;
    })
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
