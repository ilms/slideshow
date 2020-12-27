import Post from '../Post';


/**
 * Base class for e621 metatags.
 */
export default class Metatag {
  static _metatagClasses = {};

  /**
   * Verifies that the metatag matches for the post.
   * 
   * @param {Post} post The post
   * 
   * @returns {boolean} A match of the metatag
   */
  matches(post) {
    return false;
  }

  /**
   * The metatag's text name on e621
   */
  static get name() {
    return '';
  }

  /**
   * Returns the string form of the metatag.
   * 
   * @returns {string} The metatag as a string
   */
  toString() {
    return '';
  }

  static _registerMetatagClass(metatagClass) {
    Metatag._metatagClasses[metatagClass.name] = metatagClass; 
  }

  /**
   * Returns a metatag from its text form, or null if invalid.
   * 
   * @param {string} metatag The metatag in text form
   */
  static getMetatag(metatag) {
    if (!metatag.includes(':')) return null;
    let [name,value] = metatag.split(':', 1);
    if (Metatag._metatagClasses.hasOwnProperty(name)) {
      return new Metatag._metatagClasses[name](value);
    }
    return null;
  }

  /**
   * Returns true when the tag is a metatag
   * 
   * @param {string} tag 
   * 
   * @return {boolean}
   */
  static isMetatag(tag) {
    for (let i = 0; i < METATAGS.length; ++i) {
      if (tag.startsWith(METATAGS[i] + ':')) {
        return true;
      }
    }
    return false;
  }
}

const METATAGS = [
  // User-Based
  'user',
  'favoritedby',
  'voted',
  'votedup',
  'voteddown',
  'approvedby',
  'deletedby',
  // Post-Based
  // Counts
  'id',
  'score',
  'favcount',
  'comment_count',
  'tagcount',
  'gentags',
  'arttags',
  'chartags',
  'copytags',
  'spectags',
  'invtags',
  // Image Size
  'width',
  'height',
  'mpixels',
  'ratio',
  'filesize',
  // Video Duration
  'duration',
  // Dates
  'date',
  // Rating
  'rating',
  // File Types
  'type',
  // Text Searching
  'source',
  'description',
  'notes',
  'delreason',
  // Parents and Children
  'ischild',
  'isparent',
  'parent',
  // Status
  'status',
  // Other
  'hassource',
  'hasdescription',
  'ratinglocked',
  'notelocked',
  'hideanon',
  'hidegoogle',
  'inpool',
  'pool',
  'set',
  'md5',
  // Sorting
  'order',
];
