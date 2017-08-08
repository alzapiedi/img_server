import React, { PureComponent } from 'react';

export default class Image extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Image-preview" onClick={this.props.onClick}>
        <img id={this.props.id} src={this.props.src} />
      </div>
    );
  }
}
