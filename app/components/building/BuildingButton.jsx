import React from 'react'
import BuildingButtonIcon from './BuildingButtonIcon'

export default class BuildingButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <a className='building-button' href={'#' + this.props.field.href}>
        <div className='building-button-content'>
          <BuildingButtonIcon icon={this.props.field.button.icon} />
          <div className='label'>{this.props.field.button.label}</div>
        </div>
      </a>
    )
  }
}