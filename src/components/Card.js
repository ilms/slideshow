import React from 'react';

import './Card.css';


class Card extends React.Component {
  render() {
    return (
      <div className="card">
        <button onClick={this.props.callback}>
          <img src={this.props.post.previewURL} alt="" />
        </button>
      </div>
    );
  }
}

export default Card;
