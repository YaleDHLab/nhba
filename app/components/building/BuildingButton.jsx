import React from 'react'
import BuildingButtonIcon from './BuildingButtonIcon'

export default class BuildingButton extends React.Component {
  constructor(props) {
    super(props)

    this.scrollToElem = this.scrollToElem.bind(this)
  }

  scrollToElem() {
    const elem = document.getElementById(this.props.field.href);
    const container = document.querySelector('body');
    container.scrollTop = elem.offsetTop - 20;
  }

  render() {
    return (
      <div className='building-button' onClick={this.scrollToElem}>
        <div className='building-button-content'>
          <BuildingButtonIcon icon={this.props.field.button.icon} />
          <div className='label'>{this.props.field.button.label}</div>
        </div>
      </div>
    )
  }
}