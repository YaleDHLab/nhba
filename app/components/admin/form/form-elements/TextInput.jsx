import React from 'react'

export default class TextInput extends React.Component {
  constructor(props) {
    super(props)

    this.getClass = this.getClass.bind(this)
    this.updateField = this.updateField.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  getClass() {
    const width = this.props.width || ''
    const position = this.props.position || ''
    return ['text-input', width, position].join(' ')
  }

  updateField(e) {
    this.props.updateField(this.props.field, e.target.value)
  }

  handleBlur() {
    this.props.onBlur ? this.props.onBlur() : {}
  }

  render() {
    return (
      <div className={this.getClass()}>
        <div className='label'>{this.props.label}</div>
        <input
          type='text'
          value={this.props.building[this.props.field] || ''}
          onChange={this.updateField}
          onBlur={this.handleBlur} />
      </div>
    )
  }
}