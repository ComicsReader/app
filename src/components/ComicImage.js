import { Component } from 'react';

export default class ComicImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        opacity: 0
      }
    }
  }

  onImageLoad = () => {
    this.setState({
      style: {
        opacity: 1
      }
    })
  }

  render() {
    const { image, style } = this.props;

    return(
      <div style={{backgroundImage: 'url(http://i.imgur.com/ybQEnOQ.gifv)'}}>
        <img src={image}
          style={{
            display: 'block',
            margin: '0 auto 16px',
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
