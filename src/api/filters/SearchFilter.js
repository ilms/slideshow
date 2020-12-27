import Filter from './Filter';


/**
 * Filter that emulates the behavior of a e621 search
 */
export default class SearchFilter extends Filter {
  /**
   * Creates a new SearchFilter from a search query
   * 
   * @param {string} tags Search query, formatted like on e621
   */
  constructor (tags) {
    super();
    this._tags = tags;
  }

  /**
   * Approves a post when it matches with the search parameters.
   * 
   * @param {Post} post The post to approve
   * 
   * @returns {boolean} If the post matches the search query 
   */
  approve(post) {
    return this._match(post, this._tags);
  }

  /**
   * 
   * @param {*} post 
   * @param {*} tags 
   */
  static _match(post, tags) {
    let sortedTags = Filter._sortTags(tags);
    return Filter._includesAllTags(post, sortedTags['includeTags']) &&
            Filter._excludesAllTags(post, sortedTags['excludeTags']) &&
            Filter._includesAnyTag(post, sortedTags['wildcardTags']) &&
            Filter._includesAllMetatags(post, sortedTags['includeMetatags']) &&
            Filter._excludesAllMetatags(post, sortedTags['excludeMetatags']);
  }
}
