import Filter from '../Filter';
import Post from '../Post';


/**
 * Filters are classes that approve or reject posts, 
 * such as a blacklist or list of search tags.
 */
export default class AnonBlacklistFilter extends Filter {
  /**
   * Creates a new AnonBlacklistFilter for the anon blacklist
   * 
   * @param {boolean} [adhere=true] False to ignore the anon blacklist
   */
  constructor(adhere=true) {
    super();
    this._adhere = adhere;
  }

  /**
   * If the filter is currently adhering to the anon blacklist
   */
  get adhere() {
    return this._adhere;
  }

  /**
   * If the filter is currently adhering to the anon blacklist
   */
  set adhere(adhere) {
    this._adhere = adhere;
  }
  
  /**
   * Approves a post when it does not fall in the anon blacklist.
   * 
   * @param {Post} post The post to approve
   * 
   * @returns {boolean} Whether or not the post is approved
   */
  approve(post) {
    return !post.isBlocked || !this._adhere;
  }
}
