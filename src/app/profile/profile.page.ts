import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { UserService } from "../user.service";
import { AuthService } from "../auth.service";
import { User } from 'firebase';
import { Router } from '@angular/router';
import { AdMob } from '@ionic-native/admob-plus/ngx';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  mainUser: AngularFirestoreDocument;
  userPosts: string;
  sub;
  posts: string;
  userName: string;
  profilePic: string;

  constructor(
    public afStore: AngularFirestore,
    public user: UserService,
    private router: Router,
    private authService: AuthService,
    private admob: AdMob
  ) { 
    this.mainUser = afStore.doc(`users/${user.getUid()}`);
    this.sub = this.mainUser.valueChanges().subscribe(event => {
      this.posts = event.posts;
      this.userName = event.username;
      this.profilePic = event.profilePic;
      
    })
    
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub.unsubscribe();
  }

  goToPost(postId: string){
    this.router.navigate(['/tabs/post/' + postId.split('/')[0]]);
  }

  ngOnInit() {
  
    document.addEventListener('deviceready', () => {
      this.admob.interstitial.load({
        id:'ca-app-pub-9658667839326477/3866556960'
      }).then(() => this.admob.interstitial.show())
    }, false)
  
  }


  async initiateFirebaseLogout(){

    try{
      const res = await this.authService.logoutFirebase();
        console.log('User not logged in!');
        this.router.navigate(['/login']);
    } catch(err) {
      console.dir(err);
    }
  }


}
