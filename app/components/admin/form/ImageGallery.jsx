import React from 'react'
import ImageGrid from './form-elements/ImageGrid'
import FilePicker from './form-elements/FilePicker'

export default class ImageGallery extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='media-gallery'>
        <ImageGrid {...this.props}
          label={'Image Gallery'} />

        <FilePicker {...this.props}
          topLabel={'Select File'}
          bottomLabel={'Caption'} />
      </div>
    )
  }
}