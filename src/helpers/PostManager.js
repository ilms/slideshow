export class PostManager {
  constructor(fetcher) {
    this.fetcher = fetcher;
    this.posts = {};
    this.order = [];
    this.currentIndex = 0;
    // TODO manage extensions per platform
    // e621Extensions = new Set(['png','jpg','gif'])
    // faExtensions = new Set(['png','jpg','jpeg','gif','bmp'])
    this.validExtensions = new Set(['png','jpg','jpeg','gif','bmp']);
  }

  empty() {
    this.posts = {};
    this.order = [];
    this.currentIndex = 0;
  }

  fetchIfApplicable(callback) {
    if (this.fetcher.finished === false &&
        this.order.length - this.currentIndex < 20) {
      this.fetcher.fetch(this.fetchCallback.bind(this, callback));
    }
  }

  fetchCallback(callback, posts) {
    if (posts.length === 0) {
      if (callback) {
        callback(false);
      }
    } else {
      this.addPosts(posts);
      if (callback) {
        callback(true);
      }
    }
  }

  isPostAllowed(post) {
    return this.validExtensions.has(post.extension);
  }

  addPosts(posts) {
    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];
      if (this.isPostAllowed(post)) {
        this.posts[post.id] = post;
        this.order.push(post.id);
      }
    }
  }

  moveToStart() {
    this.currentIndex = 0;
  }

  moveTo(index) {
    this.currentIndex = index;
  }

  next() {
    this.currentIndex++;
    var postCount = this.order.length
    if (this.currentIndex >= postCount){
      if (postCount > 0) {
        this.currentIndex = postCount - 1;
      } else {
        this.currentIndex = 0;
      }
      return false;
    }
    this.fetchIfApplicable();
    return true;
  }

  prev() {
    this.currentIndex--;
    if (this.currentIndex < 0){
      this.currentIndex = 0;
      return false;
    }
    return true;
  }

  getPostById(id) {
    return this.posts[id];
  }

  getPostByIndex(index) {
    return this.posts[this.order[index]];
  }

  getCurrentPost() {
    return this.getPostByIndex(this.currentIndex);
  }

  getCachePosts(preload, postload) {
    let minimum = this.currentIndex - postload;
    let maximum = this.currentIndex + preload;
    if (minimum < 0) {
        minimum = 0;
    }
    if (maximum >= this.order.length) {
        maximum = this.order.length - 1;
    }
    let posts = [];
    for (let i = minimum; i <= maximum; i++) {
        posts.push(this.getPostByIndex(i));
    }
    return posts;
  }
}

export default PostManager;
