import Metatag from './Metatag';
import Post from '../Post';


/**
 * Metatag for post IDs.
 */
export default class IDMetatag extends Metatag {
  /**
   * Creates a new ID metatag.
   * 
   * @param {string|number} id The post ID
   */
  constructor (id) {
    super();
    this.id = id;
  }

  /**
   * The current ID for the metatag
   * 
   * @returns {number} The post ID
   */
  get id() {
    return this._id;
  }

  /**
   * The current ID for the metatag
   * 
   * @param {string|number} id The post ID
   */
  set id(id) {
    this._id = parseInt(id, 10);
    if (isNaN(this._id)) this._id = 0;
  }

  /**
   * Verifies that the post has the correct id.
   * 
   * @param {Post} post The post
   * 
   * @returns {boolean} True when the id matches
   */
  matches(post) {
    return post.id === this._id;
  }

  /**
   * The metatag's text name on e621
   */
  static get name() {
    return 'id';
  }

  /**
   * Returns the string form of the metatag.
   * 
   * @returns {string} The metatag as a string
   */
  toString() {
    return 'id:' + this._id;
  }
}

Metatag._metatagClasses.push(IDMetatag);
