import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// import firebase from 'firebase';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

export interface userPosts {
    id?: string;
    author: string;
    desc: string;
    pic: string;
    likes: string;
    profilePic: string;
    username: string;
  }

@Injectable()
export class GetPostsService {

    public postsCollection: AngularFirestoreCollection<userPosts>;
    public uPosts: Observable<userPosts[]>;
  
    constructor(db: AngularFirestore) {
  
      this.postsCollection = db.collection<userPosts>(`posts`);
      this.uPosts = this.postsCollection.snapshotChanges().pipe(
        map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }));
    }
  
    getPosts(){
    //   console.log(this.uPosts);
      return this.uPosts;
    }
  
    getPostID(id) {
      return this.postsCollection.doc<userPosts>(id).valueChanges();
    }
}