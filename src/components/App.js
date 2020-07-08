import React from 'react';

import E621Fetcher from '../api/E621Fetcher';
import Post from '../api/Post';
import E621Filters from './E621Filters';
import ImageCache from './ImageCache';
import Slideshow from './Slideshow';
import PostManager from '../helpers/PostManager';

import missing from '../missing.png';


class App extends React.Component {
  static missingPost = new Post(
    0,
    missing,
    missing,
    "png",
    "#"
  );

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.searchCallback = this.searchCallback.bind(this);
    this.searchEscape = this.searchEscape.bind(this);
    this.slideshowEscape = this.slideshowEscape.bind(this);
    this.slideshowNext = this.slideshowNext.bind(this);
    this.slideshowPrev = this.slideshowPrev.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.state = {
      mode: 'search',
      api: 'e621',
      settings: {},
      currentCache: [],
      slideshowPost: null,
      postManager: null,
    };
  }

  render() {
    switch (this.state.mode) {
      default:
      case 'search':
        switch(this.state.api) {
          default:
          case 'e621':
            return (
              <>
                <ImageCache posts={this.state.currentCache} />
                <E621Filters searchCallback={this.search} 
                            escape={this.searchEscape} />
              </>
            );
        }
      case 'slideshow':
        return (
          <>
            <ImageCache posts={this.state.currentCache} />
            <Slideshow post={this.state.slideshowPost || App.missingPost}
                      next={this.slideshowNext}
                      prev={this.slideshowPrev}
                      escape={this.slideshowEscape} />
          </>
        );
    }
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
    document.addEventListener('keydown', this.keydownHandler);
  }

  search(filters) {
    // TODO pass proper settings
    let settings = {limit: 50};
    let postManager = new PostManager(new E621Fetcher(filters, settings));
    postManager.fetchIfApplicable(this.searchCallback);
    this.setState({
      mode: 'slideshow',
      postManager: postManager,
    });
  }

  searchCallback() {
    this.setState({
      mode: 'slideshow',
      currentCache: this.state.postManager.getCachePosts(10, 5),
      slideshowPost: this.state.postManager.getCurrentPost(),
    });
  }

  searchEscape() {
    this.setState({
      mode: 'slideshow',
    });
  }

  slideshowEscape() {
    this.setState({
      mode: 'search',
    });
  }

  slideshowNext() {
    this.state.postManager.next();
    // TODO configure cache size with settings
    this.setState({
      currentCache: this.state.postManager.getCachePosts(10, 5),
      slideshowPost: this.state.postManager.getCurrentPost(),
    });
  }

  slideshowPrev() {
    this.state.postManager.prev();
    this.setState({
      currentCache: this.state.postManager.getCachePosts(10, 5),
      slideshowPost: this.state.postManager.getCurrentPost(),
    });
  }
}

export default App;
