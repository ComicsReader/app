import { Component } from 'react';

export default class ComicImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        opacity: 0
      },
      containerStyle: {
        width: 700,
        height: 1000,
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'solid',
      },
      width: 700,
      height: 1000
    }
  }

  onImageLoad = () => {
    if (this.refs.image.src !== "") {
      this.setState({
        style: {
          opacity: 1,
          height: 'auto',
          width: 'auto'
        },
        containerStyle: {
          width: '100%',
          height: 'auto',
          borderWidth: 0
        }
      })
    }
  }

  render() {
    const { image, style } = this.props;

    return(
      <div style={{
        background: 'url(http://i.imgur.com/ybQEnOQ.gif) 50% no-repeat',
        margin: '0 auto 16px',
        ...this.state.containerStyle
      }}>
        <img
          src={image}
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
