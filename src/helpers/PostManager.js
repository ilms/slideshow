import BlacklistFilter from '../api/filters/BlacklistFilter';


export class PostManager {
  constructor(fetcher, blacklist) {
    this.fetcher = fetcher;
    this.posts = {};
    this.order = [];
    this.pages = [];
    this.pageLocations = {};
    this.currentPostIndex = null;
    this.currentPageIndex = null;
    this.blacklistFilter = new BlacklistFilter(blacklist);
    this.lookahead = false; // PostManager will automatically get pages
    this.maxLookahead = 2000; // Max posts grabbed automatically before stopping
    // TODO manage extensions per platform
    // e621Extensions = new Set(['png','jpg','gif'])
    // faExtensions = new Set(['png','jpg','jpeg','gif','bmp'])
    this.validExtensions = new Set(['png','jpg','gif','webm']);
  }

  empty() {
    this.posts = {};
    this.order = [];
    this.pages = [];
    this.pageLocations = {};
    this.currentPostIndex = null;
    this.currentPageIndex = null;
  }

  /**
   * Starts searching for posts.
   * 
   * @param {CallableFunction} callback 
   *               Called with true when posts were found, false otherwise.
   *               This can return true while no posts are present if they 
   *               are all blacklisted or flash files. 
   */
  start(callback = () => {}) {
    this._fetch(callback);
  }

  /**
   * Fetches the next page of posts
   * 
   * @param {CallableFunction} callback 
   *               Called with true when posts were found, false otherwise.
   *               This can return true while no posts are present if they 
   *               are all blacklisted or flash files. 
   */
  _fetch(callback = () => {}) {
    if (this.fetcher.finished === false) {
      this.fetcher.fetch(this._fetchCallback.bind(this, callback));
    }
  }

  _fetchIfNeeded() {
    if (this.currentPostIndex === null) return;
    if (this.currentPostIndex >= this.order.length - 20) {
      // || this.currentPageIndex >= this.pages.length - 1) {
      this._fetch();
    }
  }

  _fetchCallback(callback, posts) {
    if (posts.length === 0) {
      if (callback) {
        callback(false);
      }
    } else {
      this._addPosts(posts);
      if (callback) {
        callback(true);
      }
      if (this.lookahead) {
        if (this.order.length < this.maxLookahead) {
          this._fetch();
        }
      }
    }
  }

  _isPostAllowed(post) {
    if (!this.validExtensions.has(post.fileExtension)) return false;
    if (!this.blacklistFilter.approve(post)) return false;
    return true;
  }

  _addPosts(posts) {
    let page = [];
    let pageIndex = this.pages.length;
    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];
      if (this._isPostAllowed(post)) {
        this.posts[post.id] = post;
        this.order.push(post.id);
        page.push(post.id);
        this.pageLocations[post.id] = pageIndex;
      }
    }
    this.pages.push(page);
  }

  moveToStart() {
    this.currentPostIndex = 0;
  }

  moveTo(index) {
    this.currentPostIndex = index;
  }

  next() {
    if (this.currentPostIndex !== null) {
      this.currentPostIndex++;
      var postCount = this.order.length
      if (this.currentPostIndex >= postCount){
        if (postCount > 0) {
          this.currentPostIndex = postCount - 1;
        } else {
          this.currentPostIndex = 0;
        }
        return false;
      }
      this._fetchIfNeeded();
      return true;
    }
  }

  prev() {
    if (this.currentPostIndex !== null) {
      this.currentPostIndex--;
      if (this.currentPostIndex < 0){
        this.currentPostIndex = 0;
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
    return this.currentPostIndex !== null ? this.getPostByIndex(this.currentPostIndex) : null;
  }

  getCachePosts(preload, postload) {
    let posts = [];
    if (this.currentPostIndex !== null) {
      let minimum = this.currentPostIndex - postload;
      let maximum = this.currentPostIndex + preload;
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
