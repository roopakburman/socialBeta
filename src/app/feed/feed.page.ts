import { Component, OnInit } from '@angular/core';
import { GetPostsService, userPosts } from '../getPosts.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  posts: userPosts[];
  constructor(public getPostsService: GetPostsService) {
  }


  ngOnInit() {
    this.getPostsService.getPosts().subscribe(res => {
      this.posts = res;
    });
  }

}
