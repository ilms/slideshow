/**
 * A wrapper class for posts from the e621 API.
 */
export default class Post {
  /**
   * When true, contentURL, previewURL, and sampleURL will ignore
   * e621's anon blacklist and return their proper URLs.
   */
  static bypassDefaultBlacklist = true;

  /**
   * Returns the URL for a resource if bypassDefaultBlacklist is true. 
   * 
   * @param {string} type
   *        '' for file, 'preview/' for preview, 'sample/' for sample
   * 
   * @returns {string|null} 
   *          The resource URL, or null if bypassDefaultBlacklist is false
   */
  _bypassURL(type) {
    if (!Post.bypassDefaultBlacklist) return null;
    let f1 = this.md5.substring(0, 2);
    let f2 = this.md5.substring(2, 4);
    return 'https://static1.e621.net/data/' + type + f1 + '/' + f2 + 
            '/' + this.md5 +'.' + (type !== '' ? 'jpg' : this.fileExtension);
  }

  /**
   * Creates a Post object from a JSON API result.
   * 
   * @param {JSON} post - A single post from the API
   */
  constructor(apiJson) {
    this.apiJson = apiJson;
  }

  /**
   * The URL linking to the post on e621.net.
   * 
   * @type {string} 
   */
  get link() {
    return 'https://e621.net/posts/' + this.apiJson['id'];
  }

  /**
   * The id of the post.
   * 
   * @type {number} 
   */
  get id() {
    return this.apiJson['id'];
  }

  /**
   * The MD5 of the file.
   * 
   * @type {string}
   */
  get md5() {
    return this.apiJson['file']['md5'];
  }

  /**
   * The width of the full size file.
   * 
   * @type {number}
   */
  get width() {
    return this.apiJson['file']['width'];
  }

  /**
   * The height of the full size file.
   * 
   * @type {number}
   */
  get height() {
    return this.apiJson['file']['height'];
  }

  /**
   * The size of the original file in bytes.
   * 
   * @type {number}
   */
  get fileSize() {
    return this.apiJson['file']['size'];
  }

  /**
   * The file extension for the full image, video, or flash file.
   * 
   * @type {string} 
   */
  get fileExtension() {
    return this.apiJson['file']['ext'];
  }

  /**
   * True when the post is blocked by the anon blacklist.
   * 
   * @type {boolean}
   */
  get isBlocked() {
    return this.apiJson['file']['url'] === null;
  }

  /**
   * The URL for the post's file (full image, original video, or flash file),
   * or null when the post is blocked by the anon blacklist.
   * 
   * @type {string|null} 
   */
  get fileURL() {
    return this.apiJson['file']['url'] || this._bypassURL('');
  }

  /**
   * The URL for the post's preview image,
   * or null when the post is blocked by the anon blacklist.
   * 
   * All preivews are limited to 150px for width and height.
   * 
   * Images have a scaled preview of their original image.
   * Videos have a scaled preview of the first frame.
   * Flash files have a square white image that says 'Flash'.
   * 
   * @type {string|null} 
   */
  get previewURL() {
    return this.apiJson['preview']['url'] || 
            (this.fileExtension === 'swf' ? 
              'https://static1.e621.net/images/download-preview.png' : 
              this._bypassURL('preview/'));
  }

  /**
   * True when the post has a sample.
   * 
   * @type {boolean} 
   */
  get hasSample() {
    return this.apiJson['sample']['has'];
  }

  /**
   * The URL for the post's sample image,
   * or null when the post is blocked by the anon blacklist.
   * 
   * Posts that dont have a sample will return the original file.
   * 
   * Images:
   * - Have a preview when full image width excedes 850px.
   * - Preview image is scaled to 850px width.
   * 
   * Videos:
   * - Always have previews
   * - Preview image is full scale of first frame.
   * 
   * Flash:
   * - Never have previews
   * 
   * @type {string|null} 
   */
  get sampleURL() {
    return this.apiJson['sample']['url'] || 
            this._bypassURL(this.hasSample === true ? 'sample/' : '');
  }

  /**
   * True when the post has alternate files.
   * 
   * @return {boolean}
   */
  get hasAlternates() {
    return this.alternateSizes.length;
  }

  /**
   * The alternates part of the JSON.
   * 
   * @returns {JSON}
   */
  get _alternatesJson() {
    return this.apiJson['sample']['alternates'];
  }

  /**
   * Array of available alternate file sizes.
   * 
   * For videos, the options are:
   * - 'original': The original resolution
   * - '480p': 480p if the original is larger
   * - '720p': 720p if the original is larger
   * 
   * @returns {Array.<string>}
   */
  get alternateSizes() {
    return Object.keys(this._alternatesJson);
  }

  /**
   * Returns the URL for the alternate of the specified size and file type.
   * 
   * @param {string} size
   *        The size of the alternate.
   *        
   *        For videos this should be:
   *        - 'original': The original resolution
   *        - '480p': 480p if the original is larger
   *        - '720p': 720p if the original is larger
   * 
   * @param {string} extension 
   *        The file extension of the alternate 
   * 
   * @returns {string|null} 
   *          The URL to the alternate, or null if not found.
   */
  getAlternate(size, extension) {
    size = size.toLowerCase();
    extension = extension.toLowerCase();
    if (!this._alternatesJson.hasOwnProperty(size)) {
      return null;
    }
    switch (extension) {
      case 'webm':
        return this._alternatesJson[size]['urls'][0] || this.fileURL;
      case 'mp4':
        return this._alternatesJson[size]['urls'][1] || this.fileURL;
      default:
        return null;
    }
  }

  /**
   * The post's score.
   * 
   * @returns {number} The score
   */
  get score() {
    return this.apiJson['score']['total'];
  }

  /**
   * The number of upvotes on the post.
   * 
   * @returns {number} The number of upvotes
   */
  get upvotes() {
    return this.apiJson['score']['up'];
  }

  /**
   * The number of downvotes on the post.
   * 
   * @returns {number} The number of downvotes
   */
  get downvotes() {
    return this.apiJson['score']['down'];
  }

  /**
   * The rating of the post.
   *  - 's': safe
   *  - 'q': questionable
   *  - 'e': explicit
   * 
   * @returns {string} A letter representing the rating
   */
  get rating() {
    return this.apiJson['rating'];
  }

  /**
   * Array of tags on the post.
   * 
   * The order of these tags will match those listed on e621.net,
   * with the exception of invalid tags which are moved to the end.
   * 
   * @returns {Array.<string>}
   */
  get tags() {
    return [
      ...this.tagsInGroup('artist'),
      ...this.tagsInGroup('copyright'),
      ...this.tagsInGroup('character'),
      ...this.tagsInGroup('species'),
      ...this.tagsInGroup('general'),
      ...this.tagsInGroup('meta'),
      ...this.tagsInGroup('lore'),
      ...this.tagsInGroup('invalid'),
    ];
  }

  /**
   * Returns array of tags in a specific group, or null for invalid groups.
   * 
   * Groups names are dependent on the API.
   * 
   * Current Groups:
   * - artist
   * - copyright
   * - character
   * - species
   * - general
   * - meta
   * - lore
   * - invalid
   * 
   * @returns {Array.<string>|null}
   */
  getTagsInGroup(group) {
    if (!this.apiJson['tags'].hasOwnProperty(group)) {
      return null;
    }
    return this.apiJson['tags'][group];
  }

  /**
   * The number of favorites for the post.
   * 
   * @returns {number} The number of favorites
   */
  get favCount() {
    return this.apiJson['fav_count']; 
  }

  /**
   * The sources of the post.
   * 
   * @returns {Array.<string>} Array of URLs
   */
  get sources() {
    return this.apiJson['sources'];
  }

  /**
   * Array of pool IDs that contain this post.
   * 
   * @returns {Array.<number>} Array of pool IDs
   */
  get poolIDs() {
    return this.apiJson['pools'];
  }

  /**
   * The ID of the parent post, or null if no parent.
   * 
   * @returns {number|null} The parent post ID
   */
  get parentID() {
    return this.apiJson['relationships']['parent_id'];
  }

  /**
   * True when the post has children (including deleted child posts).
   * 
   * @returns {boolean} Whether or not the post has children
   */
  get hasChildren() {
    return this.apiJson['relationships']['has_children'];
  }

  /**
   * True when the post has non-deleted children.
   * 
   * @returns {boolean} Whether or not the post has children
   */
  get hasActiveChildren() {
    return this.apiJson['relationships']['has_active_children'];
  }

  /**
   * Array of child post IDs.
   * 
   * @returns {Array.<number>} Array of child post IDs
   */
  get childIDs() {
    return this.apiJson['relationships']['children'];
  }

  /**
   * Returns the description of the post.
   * 
   * @returns {string} The post description
   */
  get description() {
    return this.apiJson['description']
  }

  /**
   * The number of comments on the post.
   * 
   * @returns {number} Number of comments
   */
  get commentCount() {
    return this.apiJson['comment_count'];
  }

  /**
   * True when the current user has favorited the post.
   * 
   * @returns {boolean} Whether or not the post is favorited
   */
  get favorited() {
    return this.apiJson['is_favorited'];
  }

  /**
   * Duration of the video in seconds, or null for non-videos.
   * 
   * @returns {number|null} Duration of video in seconds
   */
  get duration() {
    return this.apiJson['duration'];
  }
}
