import Metatag from './Metatag';
import Post from '../Post';


/**
 * Metatag for ratings.
 */
export default class RatingMetatag extends Metatag {
  /**
   * Creates a new rating metatag.
   * 
   * @param {string} rating
   *          Only 's', 'safe', 'q', 'questionable', 
   *          'e' and 'explicit' should be used.
   */
  constructor (rating) {
    super();
    this.rating = rating;
  }

  /**
   * The current rating for the metatag
   * 
   * @returns {string}
   *          's', 'q', 'e' For safe, questionable, or explicit,
   *          or 'u' for improperly stored values.
   */
  get rating() {
    return this._rating;
  }

  /**
   * The current rating for the metatag
   * 
   * @param {string} rating
   *          Only 's', 'safe', 'q', 'questionable', 
   *          'e' and 'explicit' should be used. 
   */
  set rating(rating) {
    switch(rating.toLowerCase()) {
      case 's':
      case 'safe':
        this._rating = 's';
        break;
      case 'q':
      case 'questionable':
        this._rating = 'q';
        break;
      case 'e':
      case 'explicit':
        this._rating = 'e';
        break;
      default:
        this._rating = 'u';
        break;
    }
  }

  /**
   * Verifies that the post has the correct rating.
   * 
   * @param {Post} post The post
   * 
   * @returns {boolean} True when the rating matches
   */
  matches(post) {
    return post.rating === this._rating;
  }

  /**
   * The metatag's text name on e621
   */
  static get name() {
    return 'rating';
  }

  /**
   * Returns the string form of the metatag.
   * 
   * @returns {string} The metatag as a string
   */
  toString() {
    return 'rating:' + this._rating;
  }
}

Metatag._metatagClasses.push(RatingMetatag);
