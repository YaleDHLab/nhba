import React from 'react'

export default class TextArea extends React.Component {
  constructor(props) {
    super(props)

    this.getClass = this.getClass.bind(this)
  }

  getClass() {
    const width = this.props.width || ''
    const position = this.props.position || ''
    return ['text-area', width, position].join(' ')
  }

  render() {
    return (
      <div className={this.getClass()}>
        <div className='label'>{this.props.label}</div>
        <textarea className='custom-textarea' rows={this.props.rows}
          placeholder='(200 words) Style guide...'
          value={this.props.value} />
      </div>
    )
  }
}