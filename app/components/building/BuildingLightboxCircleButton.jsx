import React from 'react'

export default class BuildingLightboxCircleButton extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.props.setImageIndex(this.props.index)
  }

  render() {
    const buttonClass = this.props.index === this.props.imageIndex ?
        'building-lightbox-circle-button active'
      : 'building-lightbox-circle-button'

    return (
      <div className={buttonClass}
        onClick={this.handleClick} />
    )
  }
} 
