import React from 'react';

import './Slideshow.css';
import missing from '../missing.png';


export class Slideshow extends React.Component {
  render() {
    let wrapperClassName = 'slide-wrapper';
    if (this.props.post) {
      wrapperClassName += ' content-type-' + this.props.post.fileExtension;
    }
    return (
      <div className={wrapperClassName}>
        <div className="slide">
          {this.getSlideContents()}
        </div>
        <div className="slide-controls">
          <button className="prev-button" onClick={this.props.prev}>Previous</button>
          <button className="escape-button" onClick={this.props.escape}>Close</button>
          <a className="source-button" href={this.props.post ? this.props.post.link : null} 
             target="_blank" rel="noopener noreferrer">Link</a>
          <button className="next-button" onClick={this.props.next}>Next</button>
        </div>
      </div>
    );
  }

  getSlideContents() {
    if (this.props.post) {
      switch(this.props.post.fileExtension) {
        case 'jpg':
        case 'png':
        case 'gif':
          return <img className="current-image" key={this.props.post.id}
                      src={this.props.post.fileURL} alt="" />;
        case 'webm':
          return this.getVideoElement();
        default:
          break;
      }
    }
    return <img className="current-image" src={missing} alt="" />;
  }

  getVideoElement() {
    return (
      <video className="current-video" key={this.props.post.id}
             width={this.props.post.width}
             height={this.props.post.height} 
             poster={this.props.post.sampleURL} controls>
        <source src={this.props.post.getAlternate('original', 'webm')} 
                type="video/webm" />
        <source src={this.props.post.getAlternate('original', 'mp4')} 
                type="video/mp4" />
        Your browser does not support the video tag, 
        or cannot handle webm or mp4 files.
      </video>
    );
  }
}

export default Slideshow;
