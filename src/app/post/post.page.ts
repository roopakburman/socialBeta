import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  postID: string;
  post;
  effect: string = '';
  heartType: string = "heart-empty";
  postReference: AngularFirestoreDocument;
  sub;

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private user: UserService
    ) { 

  }
  
  ngOnInit() {
    this.postID = this.route.snapshot.paramMap.get('id');
    this.postReference = this.afs.doc(`posts/${this.postID}`);
    this.sub = this.postReference.valueChanges().subscribe(val => {
      this.post = val;
      this.effect = val.effect;
      this.heartType = val.likes.includes(this.user.getUid()) ? 'heart' : 'heart-empty'
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub.unsubscribe();
  }


  toggleHeart(){
    // this.heartType = this.heartType == 'heart' ? 'heart-empty' : 'heart';
    if(this.heartType =='heart-empty'){
      this.postReference.update({
        likes: firestore.FieldValue.arrayUnion(this.user.getUid())
      })
      }else{
        this.postReference.update({
          likes: firestore.FieldValue.arrayRemove(this.user.getUid())
        })
    }
  }
}
