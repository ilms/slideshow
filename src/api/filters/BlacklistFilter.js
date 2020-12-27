import Filter from './Filter';
import Post from '../../api/Post';


/**
 * Filter that verifies that posts pass a blacklist.
 */
export default class BlacklistFilter extends Filter {
  /**
   * Creates a new BlacklistFilter for a blacklist
   * 
   * @param {string} blacklist Blacklist as formatted in user setting
   */
  constructor(blacklist) {
    super();
    this.blacklist = blacklist;
  }

  // /**
  //  * The current blacklist
  //  */
  // get blacklist() {
  //   return this._blacklist;
  // }

  /**
   * The current blacklist
   */
  set blacklist(blacklist) {
    // TODO change to linewise additions
    this._lines = [];
    let blacklistLines = blacklist.split(/\n+/);
    for (let i = 0; i < blacklistLines.length; ++i) {
      let sortedTags = Filter._sortTags(blacklistLines[i]);
      if (sortedTags['includeTags'].length !== 0
          && sortedTags['excludeTags'].length !== 0
          && sortedTags['wildcardTags'].length !== 0
          && sortedTags['includeMetatags'].length !== 0
          && sortedTags['excludeMetatags'].length !== 0) {
        this._lines.push(sortedTags);
      }
    }
  }

  /**
   * Returns true when the post is allowed by the blacklist
   * 
   * @param {Post} post - The post to approve
   * 
   * @returns {boolean} True when the post is allowed by the blacklist
   */
  approve(post) {
    for (let i = 0; i < this._lines.length; ++i) {
      if (BlacklistFilter._match(post, this._lines[i])) {
        return false;
      }
    }
    return true;
  }

  static _match(post, sortedTags) {
    return Filter._includesAllTags(post, sortedTags['includeTags']) &&
            Filter._excludesAllTags(post, sortedTags['excludeTags']) &&
            Filter._includesAnyTag(post, sortedTags['wildcardTags']) &&
            Filter._includesAllMetatags(post, sortedTags['includeMetatags']) &&
            Filter._excludesAllMetatags(post, sortedTags['excludeMetatags']);
  }
}
