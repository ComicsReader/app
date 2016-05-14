import { Component } from 'react';

export default class ComicImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        opacity: 0,
        display: 'none'
      },
      placeHolderStyle: {
        display: 'block'
      },
      imageSrc: null,
      width: 700,
      height: 1000
    }
  }

  onImageLoad = () => {
    this.setState({
      style: {
        opacity: 1,
        display: 'block'
      },
      placeHolderStyle: {
        display: 'none'
      },
    })
  }

  componentWillUpdate(nextProps, nextState) {
    // http://blog.teamtreehouse.com/learn-asynchronous-image-loading-javascript
    const { image } = nextProps;
    this.imageObj = new Image();
    this.imageObj.onload = () => {
      this.setState({
        imageSrc: this.imageObj.src
      });
    }
    // start loading
    this.imageObj.src = image;
  }

  render() {
    const { image, style } = this.props;

    return(
      <div style={{
        width: '100%'
      }}>
        <div
          style={{
            background: 'url(http://i.imgur.com/ybQEnOQ.gif) 50% no-repeat',
            width: this.state.width,
            height: this.state.height,
            borderWidth: 1,
            borderColor: 'white',
            borderStyle: 'solid',
            margin: '0 auto 16px',
            ...this.state.placeHolderStyle
          }}
        >
        </div>
        <img
          src={this.state.imageSrc}
          ref='image'
          style={{
            display: 'block',
            zIndex: 2,
            margin: '0 auto 16px',
            maxWidth: '100%',
            transition: 'opacity .25s',
            ...this.state.style,
            ...style
          }}
          onLoad={this.onImageLoad}
        />
      </div>
    )
  }

}
