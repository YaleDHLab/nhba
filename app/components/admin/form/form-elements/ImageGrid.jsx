import React from 'react'
import request from 'superagent'

export default class ImageGrid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      images: []
    }

    this.getStyle = this.getStyle.bind(this)
  }

  componentDidMount() {
    let images = [];
    let url = 'http://lorempixel.com/400/300/city/';
    _.range(11).forEach((i) => images.push(url + i))
    this.setState({images: images})
  }

  getStyle(image) {
    return {
      backgroundImage: 'url(' + image + ')'
    }
  }

  render() {
    return (
      <div className='image-grid'>
        <div className='label'>{this.props.label}</div>
        <div className='image-grid-content'>

          {this.state.images.map((image, i) => {
            return (
              <div className='grid-item-container' key={i}>
                <div className='grid-item background-image'
                  style={this.getStyle(image)} />
              </div>
            )
          })}

        </div>
      </div>
    )
  }
}
