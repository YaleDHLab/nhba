import React from 'react'
import request from 'superagent'
import update from 'react/lib/update'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ImageGridItem from './ImageGridItem'

@DragDropContext(HTML5Backend)
export default class ImageGrid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      images: []
    }

    this.moveImage = this.moveImage.bind(this)
  }

  componentDidMount() {
    let images = [];
    let url = 'https://lorempixel.com/400/300/city/';
    _.range(11).forEach((i) => images.push({
      id: i,
      url: url + i
    }))
    this.setState({images: images})
  }

  moveImage(dragIndex, hoverIndex) {
    const { images } = this.state
    const dragImage = images[dragIndex]
    this.setState(update(this.state, {
      images: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragImage],
        ],
      },
    }));
  }

  render() {
    return (
      <div className='image-grid'>
        <div className='label'>{this.props.label}</div>
        <div className='image-grid-content'>
          {this.state.images.map((image, i) => {
            return (
              <ImageGridItem
                key={image.id}
                index={i}
                id={image.id}
                image={image.url}
                moveImage={this.moveImage} />)
          })}
        </div>
      </div>
    )
  }
}
