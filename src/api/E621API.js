import $ from 'jquery';

import Authentication from '../helpers/Authentication';


const USER_AGENT = "Ilm's Slideshow/2.0";

/**
 * This class contains methods for interfacing directly with the e621 API.
 */
export default class E621API {
  /**
   * Returns URL parameters that should be present with every request.
   * This includes the user agent and login credentials.
   * 
   * @returns {Object.<string, string>} URL parameters
   */
  static _getURLAddons() {
    // TODO switch to HTTP Basic Auth when possible
    return {
      _client: USER_AGENT,
      ...Authentication.authParameters,
    };
  }

  /**
   * Gets a list of posts. Equivalent to an e621 search.
   * 
   * @param {Object} request - The parameters of the request
   * 
   * @param {string} request.tags
   *        Follows conventions of the e621 search box
   * 
   * @param {number|string} request.page
   *        Page number, or 'b'+post_id or 'a'+post_id for posts
   *        before or after a specific post
   * 
   * @param {number|null} request.limit 
   *        Number of posts per page (API has hard limit of 320)
   *        or null for user's default (or 75 if not logged in)
   * 
   * @param {successCallback} request.success
   *        Callback function to handle successful requests.
   * 
   * @param {callback} request.failure
   *        Callback function to handle failed requests.
   */
  static async getPosts({
      tags='', 
      page=1, 
      limit=null, 
      success=()=>{}, 
      failure=()=>{},
  }={}) {
    let params = {
      tags: tags,
      page: page,
    };
    if (limit !== null) {
      params['limit'] = limit;
    }
    $.ajax({
      type: 'GET',
      url: 'https://e621.net/posts.json',
      data: {
        ...params,
        ...E621API._getURLAddons(),
      },
      success: success,
      failure: failure,
    });
  }

  static async addPostToSet({
    post_id=null,
    set_id=null,
    success=()=>{}, 
    failure=()=>{},
  }={}) {
    if (post_id === null || set_id === null || set_id === '') {
      setTimeout(() => { failure(); }, 0);
      return;
    }
    let params = {
      'post_ids[]': post_id,
    };
    // TODO add better error handling, i.e. message of issue
    $.ajax({
      type: 'POST',
      url: 'https://e621.net/post_sets/' + set_id + '/add_posts.json',
      data: {
        ...params,
        ...E621API._getURLAddons(),
      },
      success: success,
      failure: failure,
      error: failure,
    });
  }

  static async getUser({
    user,
    success=()=>{}, 
    failure=()=>{},
  }={}) {
    if (!user) {
      setTimeout(() => { failure(); }, 0);
      return;
    }
    $.ajax({
      type: 'GET',
      url: 'https://e621.net/users/' + user + '.json',
      data: E621API._getURLAddons(),
      success: success,
      failure: failure,
    });
  }

  // TODO write documention - gets sets available to user (owned + managed)
  static async getSets({
    success=()=>{}, 
    failure=()=>{},
  }={}) {
    $.ajax({
      type: 'GET',
      url: 'https://e621.net/post_sets/for_select.json',
      data: E621API._getURLAddons(),
      success: success,
      failure: failure,
      error: failure,
    });
  }
}

/**
 * Callback function for successful API calls.
 * @callback successCallback
 * @param {Object} data - The JSON response from the API call
 */
