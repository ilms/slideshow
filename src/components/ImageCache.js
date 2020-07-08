import React from 'react';


export class ImageCache extends React.Component {
  render() {
    return (
      <div style={{display: "none"}}>
        {this.getImages(this.props.posts)}
      </div>
    );
  }

  getImages(posts) {
    let images = [];
    for (let i = 0; i < posts.length; i++) {
      images.push(<img src={posts[i].contentURL} alt="" />)
    }
    return images;
  }
}

export default ImageCache;
