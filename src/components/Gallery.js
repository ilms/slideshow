import React from 'react';

import Card from './Card';

import './Gallery.css';


class Gallery extends React.Component {
  render() {
    return (
      <div className="gallery">
        <div className="gallery-controls">
          <button onClick={this.props.openSearch}>Search</button>
          <button onClick={this.props.openSettings}>Settings</button>
        </div>
        <div className="gallery-controls">
          <button onClick={this.props.prevPage} disabled={!this.props.prevPage}>Prev Page</button>
          <button onClick={this.props.nextPage} disabled={!this.props.nextPage}>Next Page</button>
        </div>
        <div className="gallery-content">
          {this.getCards()}
        </div>
        <div className="gallery-controls">
          <button onClick={this.props.prevPage} disabled={!this.props.prevPage}>Prev Page</button>
          <button onClick={this.props.nextPage} disabled={!this.props.nextPage}>Next Page</button>
        </div>
      </div>
    );
  }

  getCards() {
    let cards = [];
    if (this.props.postManager) {
      let posts = this.props.postManager.getAllPosts();
      for (let i = 0; i < posts.length; i++) {
        cards.push(
          <Card key={posts[i].id}
                post={posts[i]} 
                callback={() => {this.props.viewPost(i)}} />
        );
      }
    }
    return cards;
  }
}

export default Gallery
