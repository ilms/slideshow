import React from 'react';


class Field extends React.Component {
  render() {
    let {label, ...other} = this.props;
    return (
      <>
        <h2>{label}</h2>
        <input {...other} />
      </>
    );
  }
}

export default Field;
