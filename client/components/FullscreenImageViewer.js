import React, { PureComponent } from 'react';

export default class FullscreenImageViewer extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.getElementById(this.props.id).webkitRequestFullscreen();
    this.props.registerEventHandlers();
  }

  render() {
    return (
      <img className="Image-full" id={this.props.id} src={this.props.src} />
    );
  }
}
