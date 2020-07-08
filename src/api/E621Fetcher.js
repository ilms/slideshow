import $ from 'jquery';

import Post from './Post';
import ThrottleQueue from '../helpers/ThrottleQueue';


export class E621Fetcher {
  static userAgent = "Ilm's Slideshow/1.0";
  static queue = new ThrottleQueue(1000);

  constructor(filters, settings) {
    this.filters = filters;
    this.settings = settings;
    this.page = 1;
    this.fetching = false;
    this.finished = false;
  }

  getURL() {
    // TODO add login from settings
    return 'https://e621.net/posts.json?' + new URLSearchParams({
      "_client": E621Fetcher.userAgent,
      "tags": this.filters.tags,
      "limit": this.settings.limit,
      "page": this.page,
    }).toString();
  }

  fetch(callback) {
    if (this.finished === false && this.fetching === false){
      this.fetching = true;
      let url = this.getURL();
      let ajaxCallback = this.fetchCallback.bind(this, callback);
      E621Fetcher.queue.add(function() {
        $.ajax({
          url: url,
          crossDomain: true,
          dataType: 'json',
          success: ajaxCallback,
        });
      });
      this.currentPage++;
    }
  }

  fetchCallback(callback, data) {
    this.fetching = false;
    if (data['posts'].length === 0) {
      this.finished = 0;
      callback([]);
    } else {
      let posts = this.getPosts(data['posts']);
      callback(posts)
    }
  }

  getPosts(jsonPosts) {
    let posts = [];
    for (let i = 0; i < jsonPosts.length; i++) {
        let id = jsonPosts[i]['id'];
        let contentURL = jsonPosts[i]['file']['url'];
        let previewURL = jsonPosts[i]['preview']['url'];
        let extension = jsonPosts[i]['file']['ext'];
        let link = 'https://e621.net/posts/' + id;
        if (contentURL === null) continue; // Skip if blacklisted
        posts.push(new Post(
            id,
            contentURL,
            previewURL,
            extension,
            link,
        ));
    }
    return posts;
  }
}

export default E621Fetcher;
