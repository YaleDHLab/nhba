import React from 'react'
import Multiselect from '../../../Multiselect'

export default class Select extends React.Component {
  constructor(props) {
    super(props)

    this.getClass = this.getClass.bind(this)
    this.updateField = this.updateField.bind(this)
  }

  getClass() {
    const defaultClass = 'select';
    const width = this.props.width || '';
    const position = this.props.position || '';
    return [defaultClass, width, position].join(' ')
  }

  updateField(field, option) {
    this.props.updateField(field, option)
  }

  render() {
    const select = {
      label: this.props.label,
      field: this.props.field
    }

    return (
      <div className={this.getClass()}>
        <div className='label'>{this.props.label}</div>

        <Multiselect
          label={this.props.label}
          field={this.props.field}
          values={this.props.building[this.props.field]}
          options={this.props.options[this.props.field]}
          handleChange={this.updateField}
          className={'custom-select'} />
      </div>
    )
  }
}