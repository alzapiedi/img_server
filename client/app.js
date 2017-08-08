import React, { Component } from 'react';

import FullscreenImageViewer from './components/FullscreenImageViewer';
import Image from './components/Image';
import fetchImages from './utils/fetchImages';

const IMAGE_LOADING_THRESHOLD = 0.6;

let _images = [];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      numImages: 25,
      fullscreenImageIndex: null,
      isFullscreenEnabled: false
    };
  }

  componentDidMount() {
    fetchImages().then(images => {
      _images = images;
      this.setState({ images: images.length > 25 ? images.slice(0,25) : images });
      if (images.length > 25) this.registerScrollListener();
    })
    .catch(e => alert(e.message));
  }

  registerScrollListener() {
    window.onscroll = () => {
      if (window.scrollY / document.documentElement.scrollHeight > IMAGE_LOADING_THRESHOLD) this.addImages();
    }
  }

  render() {
    return (
      <section id="main">
        {this.renderFullscreen()}
        {this.state.images.map(this.renderImage, this)}
      </section>
    );
  }

  renderFullscreen() {
    if (!this.state.isFullscreenEnabled) return;
    return (
      <FullscreenImageViewer
        id="fullscreenImage"
        src={`/private/${this.state.images[this.state.fullscreenImageIndex]}`}
        registerEventHandlers={this.registerEventHandlers} />
    );
  }

  renderImage(image, i) {
    return (
      <Image
        src={`/private/${image}`}
        key={`image-${i}`}
        id={`image-${i}`}
        index={i}
        onClick={this.setFullscreen.bind(this, i)} />
    );
  }

  addImages() {
    let numImages = this.state.numImages + 25 > _images.length ? _images.length : this.state.numImages + 25;
    this.setState({ images: _images.slice(0, numImages), numImages });
  }

  nextImage = () => {
    if (this.state.fullscreenImageIndex === this.state.numImages - 1) return;
    if (this.state.fullscreenImageIndex / this.state.numImages > IMAGE_LOADING_THRESHOLD) this.addImages();
    this.setState({ fullscreenImageIndex: this.state.fullscreenImageIndex + 1 });
  }

  previousImage = () => {
    if (this.state.fullscreenImageIndex === 0) return;
    this.setState({ fullscreenImageIndex: this.state.fullscreenImageIndex - 1 });
  }

  clearFullscreen = () => {
    const currentImage = document.getElementById(`image-${this.state.fullscreenImageIndex}`);
    this.setState({ fullscreenImageIndex: null, isFullscreenEnabled: false }, () => {
      window.scrollTo(0, currentImage.y);
    });
    window.onkeydown = null;
  }

  setFullscreen(fullscreenImageIndex) {
    this.setState({ isFullscreenEnabled: true, fullscreenImageIndex });
  }

  registerEventHandlers = () => {
    window.onkeydown = (e) => {
      if (e.keyCode === 39) this.nextImage();
      if (e.keyCode === 37) this.previousImage();
    }
    document.addEventListener('webkitfullscreenchange', () => {
      if (!document.webkitFullscreenElement && this.state.isFullscreenEnabled) this.clearFullscreen();
    });
  }
}
