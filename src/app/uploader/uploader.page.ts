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
  noFace: boolean = false;

  scaleCrop: string = '-/scale_crop/200x200';
  effects = {
    effect1: '',
    effect2: '-/exposure/50/-/saturation/50/-/warmth/-30/',
    effect3: '-/filter/vevera/150/',
    effect4: '-/filter/carris/150/',
    effect5: '-/filter/misiara/150/',
  }
  activeEffect: string = this.effects.effect1;
  busy: boolean = false;

  @ViewChild('fileButton') fileButton: {
    nativeElement: HTMLInputElement;
  }
  constructor(
    public http: Http,
    public afStore: AngularFirestore,
    public user: UserService,
    public alerts: AlertController,
    public router: Router
  ) { }

  ngOnInit() {
  }


  async createPost() {
    this.busy = true;

    const image = this.imageURL;
    const activeEffect = this.activeEffect;
    const desc = this.desc;

    this.afStore.doc(`users/${this.user.getUid()}`).update({
      posts: firestore.FieldValue.arrayUnion(`${image}/${activeEffect}`)
    })

    this.afStore.doc(`posts/${image}`).set({
      desc,
      author: this.user.getUserName(),
      likes: [],
      effect: activeEffect
    })
    this.busy = false;
    this.imageURL = "";
    this.desc = "";

    this.showAlert('Success', 'Your Post was Created');
    this.router.navigate(['/tabs/feed']);

  }

  uploadFile() {
    this.fileButton.nativeElement.click();

  }
  setSelected(effect: string) {

    this.activeEffect = this.effects[effect];

  }

  fileChanged(event) {
    this.busy = true;

    const files = event.target.files;
    console.log(files);

    const data = new FormData;
    data.append('file', files[0]);
    data.append('UPLOADCARE_STORE', '1');
    data.append('UPLOADCARE_PUB_KEY', '5dee6ad79fc8971ae0a0');

    this.http.post('https://upload.uploadcare.com/base/', data)
      .subscribe(event => {
        console.log(event);
        this.imageURL = event.json().file;
        this.busy = false;

        this.http.get(`https://ucarecdn.com/${this.imageURL}/detect_faces/`)
        .subscribe(event => {
          this.noFace = event.json().faces ==0;
        })
      })
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alerts.create({
      header,
      message,
      buttons: ['COOL!']
    });
    await alert.present();
  }
}
