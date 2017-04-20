import React from 'react'

export default class TextArea extends React.Component {
  constructor(props) {
    super(props)

    this.getClass = this.getClass.bind(this)
    this.updateField = this.updateField.bind(this)
  }

  getClass() {
    const width = this.props.width || ''
    const position = this.props.position || ''
    return ['text-area', width, position].join(' ')
  }

  updateField(e) {
    this.props.updateField(this.props.field, e.target.value)
  }

  render() {
    return (
      <div className={this.getClass()}>
        <div className='label'>{this.props.label}</div>
        <textarea className='custom-textarea'
          rows={this.props.rows}
          placeholder='(200 words) Style guide...'
          value={this.props.building[this.props.field] || ''} />
      </div>
    )
  }
}