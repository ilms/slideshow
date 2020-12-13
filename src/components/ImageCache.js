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
      images.push(<img key={posts[i].id} alt=""
        src={posts[i].fileExtension === 'webm' ? 
              posts[i].sampleURL : posts[i].fileURL}/>)
    }
    return images;
  }
}

export default ImageCache;
