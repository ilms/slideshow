import Metatag from './Metatag';
import Post from '../Post';


/**
 * Metatag for file types.
 */
export default class TypeMetatag extends Metatag {
  /**
   * Creates a new type metatag.
   * 
   * @param {string} type
   *          One of:
   *          - 'png' - PNG image
   *          - 'jpg' - JPEG image
   *          - 'gif' - GIF image
   *          - 'webm' - WEBM video
   *          - 'swf' - Flash file
   */
  constructor (type) {
    super();
    this.type = type;
  }

  /**
   * The current type for the metatag
   * 
   * @returns {string}
   *          One of:
   *          - 'png' - PNG image
   *          - 'jpg' - JPEG image
   *          - 'gif' - GIF image
   *          - 'webm' - WEBM video
   *          - 'swf' - Flash file
   */
  get type() {
    return this._type;
  }

  /**
   * The current type for the metatag
   * 
   * @param {string} type
   *          One of:
   *          - 'png' - PNG image
   *          - 'jpg' - JPEG image
   *          - 'gif' - GIF image
   *          - 'webm' - WEBM video
   *          - 'swf' - Flash file
   */
  set type(type) {
    this._type = type;
  }

  /**
   * Verifies that the post has the correct file type.
   * 
   * @param {Post} post The post
   * 
   * @returns {boolean} True when the type matches
   */
  matches(post) {
    return post.fileExtension === this._type;
  }

  /**
   * The metatag's text name on e621
   */
  static get name() {
    return 'type';
  }

  /**
   * Returns the string form of the metatag.
   * 
   * @returns {string} The metatag as a string
   */
  toString() {
    return 'type:' + this._type;
  }
}

Metatag._metatagClasses.push(TypeMetatag);
