import Metatag from '../metatags/Metatag';
import Post from '../Post';


/**
 * Filters are classes that approve or reject posts, 
 * such as a blacklist or list of search tags.
 */
export default class Filter {
  /**
   * Approves a post when matching a certain criteria.
   * 
   * @param {Post} post The post to approve
   * 
   * @returns {boolean} Whether or not the post is approved
   */
  approve(post) {
    return true;
  }

  static _includesTag(post, tag) {
    return post.tags.includes(tag);
  }

  static _includesAllTags(post, tags) {
    for (let i = 0; i < tags.length; ++i) {
      if (!this._includesTag(post, tags[i])) {
        return false;
      }
    }
    return true;
  }

  static _excludesAllTags(post, tags) {
    for (let i = 0; i < tags.length; ++i) {
      if (this._includesTag(post, tags[i])) {
        return false;
      }
    }
    return true;
  }

  static _includesAnyTag(post, tags) {
    if (tags.length === 0) return true;
    for (let i = 0; i < tags.length; ++i) {
      if (this._includesTag(post, tags[i])) {
        return true;
      }
    }
    return false;
  }

  static _includesAllMetatags(post, metatags) {
    for (let i = 0; i < metatags.length; ++i) {
      if (!metatags[i].matches(post)) {
        return false;
      }
    }
    return true;
  }

  static _excludesAllMetatags(post, metatags) {
    for (let i = 0; i < metatags.length; ++i) {
      if (metatags[i].matches(post)) {
        return false;
      }
    }
    return true;
  }

  static _getExcludeTag(tag) {
    if (tag.startsWith('-') && tag.length > 1) {
      return tag.substring(1);
    }
    return null;
  }

  static _getWildcardTag(tag) {
    if (tag.startsWith('~') && tag.length > 1) {
      return tag.substring(1);
    }
    return null;
  }

  static _isInvalidTag(tag) {
    if (tag === '') return true;
    if (tag === '-') return true;
    if (tag === '~') return true;
    if (/[%,#\\* ]/.test(tag)) return true;
    return false;
  }

  static _sortTags(tags) {
    let sorted = {
      includeTags: [],
      excludeTags: [],
      wildcardTags: [],
      includeMetatags: [],
      excludeMetatags: [],
    }
    let tagList = tags.split(/\s+/);
    for (let i = 0; i < tagList.length; i++) {
      if (Filter._isInvalidTag(tagList[i])) continue;
      let excludeTag = Filter._getExcludeTag(tagList[i]);
      if (excludeTag !== null) {
        if (Metatag.isMetatag(excludeTag)) {
          let excludeMetatag = Metatag.getMetatag(excludeTag);
          if (excludeMetatag !== null) {
            sorted['excludeMetatags'].push(excludeMetatag);
            continue;
          } else {
            // ignore invalid/unimplemented metatags
            continue;
          }
        } else {
          sorted['excludeTags'].push(excludeTag);
          continue;
        }
      }
      let wildcardTag = Filter._getWildcardTag(tagList[i]);
      if (wildcardTag !== null) {
        sorted['wildcardTags'].push(wildcardTag);
        continue;
      }
      if (Metatag.isMetatag(tagList[i])) {
        let metatag = Metatag.getMetatag(tagList[i]);
        if (metatag !== null) {
          sorted['includeMetatags'].push(metatag);
          continue;
        } else {
          // ignore invalid/unimplemented metatags
          continue;
        }
      }
      sorted['includeTags'].push(tagList[i]);
    }
    return sorted;
  }
}
