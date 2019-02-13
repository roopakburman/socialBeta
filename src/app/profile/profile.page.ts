import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { UserService } from "../user.service";
import { User } from 'firebase';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userPosts
  constructor(
    public afStore: AngularFirestore,
    public user: UserService
  ) { 
    const posts = afStore.doc(`users/${user.getUid()}`);
    this.userPosts = posts.valueChanges();
  }

  ngOnInit() {
  }



}
