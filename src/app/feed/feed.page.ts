import { Component, OnInit } from '@angular/core';
import { GetPostsService, userPosts } from '../getPosts.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  sub;
  posts: userPosts[];
  constructor(
    public getPostsService: GetPostsService
    
    ) {
  }


  ngOnInit() {
    this.sub = this.getPostsService.getPosts().subscribe(res => {
      this.posts = res;
      console.dir(this.posts);      
    });

  
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub.unsubscribe();
  }

}
