import React from 'react';


class Field extends React.Component {
  render() {
    return (
      <>
        <h2>{this.props.label}</h2>
        <input {...this.props} />
      </>
    );
  }
}

export default Field;
