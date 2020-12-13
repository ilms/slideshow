export class PostManager {
  constructor(fetcher) {
    this.fetcher = fetcher;
    this.posts = {};
    this.order = [];
    this.currentIndex = null;
    // TODO manage extensions per platform
    // e621Extensions = new Set(['png','jpg','gif'])
    // faExtensions = new Set(['png','jpg','jpeg','gif','bmp'])
    this.validExtensions = new Set(['png','jpg','gif','webm']);
  }

  empty() {
    this.posts = {};
    this.order = [];
    this.currentIndex = null;
  }

  fetchIfApplicable(callback) {
    if (this.fetcher.finished === false &&
        (this.currentIndex === null ||
         this.order.length - this.currentIndex < 20)) {
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
    return this.validExtensions.has(post.fileExtension);
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
    if (this.currentIndex !== null) {
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
  }

  prev() {
    if (this.currentIndex !== null) {
      this.currentIndex--;
      if (this.currentIndex < 0){
        this.currentIndex = 0;
        return false;
      }
      return true;
    }
  }

  getPostById(id) {
    return this.posts[id];
  }

  getPostByIndex(index) {
    return this.posts[this.order[index]];
  }

  getAllPosts() {
    let allPosts = [];
    for (let i = 0; i < this.order.length; i++) {
      allPosts.push(this.posts[this.order[i]]);
    }
    return allPosts;
  }

  getCurrentPost() {
    return this.currentIndex !== null ? this.getPostByIndex(this.currentIndex) : null;
  }

  getCachePosts(preload, postload) {
    let posts = [];
    if (this.currentIndex !== null) {
      let minimum = this.currentIndex - postload;
      let maximum = this.currentIndex + preload;
      if (minimum < 0) {
          minimum = 0;
      }
      if (maximum >= this.order.length) {
          maximum = this.order.length - 1;
      }
      for (let i = minimum; i <= maximum; i++) {
          posts.push(this.getPostByIndex(i));
      }
    }
    return posts;
  }
}

export default PostManager;
