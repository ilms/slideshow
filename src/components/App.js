import React from 'react';

import E621API from '../api/E621API';
import E621Searcher from '../api/E621Searcher';
import E621Filters from './E621Filters';
import E621Settings from './E621Settings';
import Gallery from './Gallery';
import ImageCache from './ImageCache';
import Slideshow from './Slideshow';
import PostManager from '../helpers/PostManager';

import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.searchCallback = this.searchCallback.bind(this);
    this.openSlideshow = this.openSlideshow.bind(this);
    this.openGallery = this.openGallery.bind(this);
    this.slideshowNext = this.slideshowNext.bind(this);
    this.slideshowPrev = this.slideshowPrev.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.openSearch = this.openSearch.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.galleryViewPost = this.galleryViewPost.bind(this);
    this.addToSet = this.addToSet.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
    this.state = {
      mode: 'search',
      api: 'e621',
      settings: E621Settings.initialState,
      currentCache: [],
      slideshowPost: null,
      posts: [],
      postManager: null,
    };
  }

  render() {
    return (
      <>
        <div className={this.state.mode === 'search' ? 'mount show' : 'mount'}>
          <E621Filters searchCallback={this.search} 
                       escape={this.openGallery} />
        </div>
        <div className={this.state.mode === 'slideshow' ? 'mount show' : 'mount'}>
          <Slideshow post={this.state.slideshowPost}
                     next={this.slideshowNext}
                     prev={this.slideshowPrev}
                     escape={this.openGallery}
                     addToSet={this.addToSet} />
        </div>
        <div className={this.state.mode === 'gallery' ? 'mount show' : 'mount'}>
          <Gallery postManager={this.state.postManager}
                   openSearch={this.openSearch}
                   openSettings={this.openSettings}
                   viewPost={this.galleryViewPost} />
        </div>
        <div className={this.state.mode === 'settings' ? 'mount show' : 'mount'}>
          <E621Settings close={this.openGallery} 
                        onSettingsChange={this.onSettingsChange} />
        </div>
        <ImageCache posts={this.state.currentCache} />
      </>
    );
  }

  keydownHandler(e) {
    if (this.state.mode === 'slideshow') {
      var key = e.which || e.keyCode;
      
      switch (key) {
        case 37: // Left arrow
        case 65: // A
          this.slideshowPrev();
          return;
        case 39: // Right arrow
        case 68: // D
          this.slideshowNext();
          return;
        default: return;
      }
    }
  }
  
  componentDidMount() { 
    document.addEventListener('keydown', this.keydownHandler);
  }

  componentWillUnmount() { 
    document.removeEventListener('keydown', this.keydownHandler);
  }

  search(filters) {
    // TODO pass proper settings
    let settings = {limit: 30};
    let postManager = new PostManager(
      new E621Searcher(filters.tags, settings.limit),
      this.state.settings.userBlacklist,
    );
    postManager.start(this.searchCallback);
    this.setState({
      mode: 'gallery',
      postManager: postManager,
    });
  }

  update() {
    // TODO configure cache size with settings
    this.setState({
      posts: this.state.postManager.getAllPosts(),
      currentCache: this.state.postManager.getCachePosts(10, 5),
      slideshowPost: this.state.postManager.getCurrentPost(),
    });
  }

  searchCallback() {
    this.update();
  }

  openSearch() {
    this.setState({
      mode: 'search',
    })
  }

  openSlideshow() {
    this.setState({
      mode: 'slideshow',
    });
  }

  openGallery() {
    this.setState({
      mode: 'gallery',
    });
  }

  openSettings() {
    this.setState({
      mode: 'settings',
    });
  }

  slideshowNext() {
    this.state.postManager.next();
    this.update();
  }

  slideshowPrev() {
    this.state.postManager.prev();
    this.update();
  }

  galleryViewPost(index) {
    this.state.postManager.moveTo(index);
    this.update();
    this.setState({
      mode: 'slideshow',
    });
  }

  addToSet({
    success=()=>{}, 
    failure=()=>{},
  }={}) {
    let post = this.state.postManager.getCurrentPost();
    E621API.addPostToSet({
      post_id: post.id,
      set_id: this.state.settings.setID,
      success: success,
      failure: failure,
    });
  }

  onSettingsChange(settings) {
    this.setState((state) => {
      return {settings: {...state.settings, ...settings}};
    });
  }
}

export default App;
