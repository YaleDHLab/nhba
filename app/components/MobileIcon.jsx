import React from 'react'

export default class MobileIcon extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    this.props.handleClick(this.props.label)
  }

  render() {
    const className = this.props.view === this.props.label ?
        'mobile-icon active'
      : 'mobile-icon';

    return (
      <div className={className} onClick={this.handleClick}>
        <object data={'/assets/images/' + this.props.filename + '.svg'}
          type='image/svg+xml'
          className={this.props.filename}>
          <img src={'/assets/images/' + this.props.filename + '.png'} />
        </object>
        <div>{this.props.label}</div>
      </div>
    )
  }
} 
