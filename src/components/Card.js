import React from 'react';

import './Card.css';


class Card extends React.Component {
  render() {
    let className = 'card';
    className += ' content-type-' + this.props.post.fileExtension;
    return (
      <div className={className}>
        <button onClick={this.props.callback}>
          <img src={this.props.post.previewURL} alt="" />
        </button>
      </div>
    );
  }
}

export default Card;
