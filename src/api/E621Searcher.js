import E621API from './E621API';
import Post from './Post';
import ThrottleQueue from '../helpers/ThrottleQueue';


/**
 * This class 
 */
export default class E621Searcher {
  static queue = new ThrottleQueue(1000);

  constructor(tags) {
    this.tags = tags;
    this.limit = 100;
    this._page = 1;
    this._fetching = false;
    this._finished = false;
  }

  fetch(callback) {
    if (this._finished === true) {
      setTimeout(() => { callback([]); }, 0);
      return true;
    } else if (this._fetching === true) {
      return false;
    } else {
      this._fetching = true;
      let request = {
        tags: this.tags,
        page: this._page,
        limit: this.limit,
        success: this._fetchSuccess.bind(this, callback),
      }
      E621Searcher.queue.add(function() {
        E621API.getPosts(request);
      });
      this._page++;
      return true;
    }
  }

  _fetchSuccess(callback, data) {
    this._fetching = false;
    if (data['posts'].length === 0) {
      this._finished = true;
      callback([]);
    } else {
      let posts = [];
      for (let i = 0; i < data['posts'].length; ++i) {
        posts.push(new Post(data['posts'][i]));
      }
      callback(posts);
    }
  }

  get finished() {
    return this._finished;
  }
}
