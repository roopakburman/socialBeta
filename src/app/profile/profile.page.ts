import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { UserService } from "../user.service";
import { User } from 'firebase';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userPosts
  constructor(
    public afStore: AngularFirestore,
    public user: UserService,
    private router: Router
  ) { 
    const posts = afStore.doc(`users/${user.getUid()}`);
    this.userPosts = posts.valueChanges();
  }

  goToPost(postId: string){
    this.router.navigate(['/tabs/post/' + postId]);
  }

  ngOnInit() {
  }



}
