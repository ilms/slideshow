/**
 * This class handles all methods for storing and reading e621
 * login credentials for the API
 */
class Authentication {
  /**
   * Stores the login credentials for a user.
   * 
   * @param {string} username - The user's username
   * 
   * @param {string} apiKey - One of the user's API keys
   */
  static storeLogin(username, apiKey) {
    window.localStorage.setItem('username', username);
    window.localStorage.setItem('api_key', apiKey);
  }

  /**
   * Removes the currently stored user credentials.
   */
  static removeLogin() {
    window.localStorage.removeItem('username');
    window.localStorage.removeItem('api_key');
  }

  /**
   * Gets the credentials for authenticating via URL parameters.
   * This method of authentication is not recommended.
   * 
   * @returns {AuthParams|Object} 
   *          The URL parameters or an empty object if not logged in
   */
  static get authParameters() {
    var username = window.localStorage.getItem('username');
    var apiKey = window.localStorage.getItem('api_key');
    if (username !== null && apiKey !== null) {
      return {login: username, api_key: apiKey};
    } else {
      return {};
    }
  }

  /**
   * Gets the request headers for authenticating via HTTP Basic Auth.
   * 
   * @returns {AuthHeaders|Object}
   *          The headers or an empty object if not logged in
   */
  static get authHeaders() {
    var username = window.localStorage.getItem('username');
    var apiKey = window.localStorage.getItem('api_key');
    if (username !== null || apiKey !== null) {
      return {'Authorization': 'Basic ' + btoa(username + ':' + apiKey)};
    } else {
      return {};
    }
  }

  /**
   * Returns the current users username, or null if not logged in.
   * 
   * @returns {string|null} The username
   */
  static get username() {
    return window.localStorage.getItem('username');
  }
}

export default Authentication;

/**
 * @typedef {Object} AuthParams
 * @property {string} login - The user's username
 * @property {string} api_key - One of the user's API keys
 */

/**
 * @typedef {Object} AuthHeaders
 * @property {string} Authorization - The HTTP basic auth credentials
 */
