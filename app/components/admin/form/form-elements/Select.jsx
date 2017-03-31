import React from 'react'

export default class Select extends React.Component {
  constructor(props) {
    super(props)

    this.getClass = this.getClass.bind(this)
  }

  getClass() {
    const width = this.props.width || ''
    const position = this.props.position || ''
    return ['select', width, position].join(' ')
  }

  render() {
    return (
      <div className={this.getClass()}>
        <div className='label'>{this.props.label}</div>
        <select className='custom-select'>
          <option value='select'>Select</option>
        </select>
      </div>
    )
  }
}