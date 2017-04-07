import React from 'react'
import api from '../../../config'

export default class Select extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      options: []
    }

    this.updateSelect = this.updateSelect.bind(this)
  }

  componentDidMount() {
    const field = this.props.select.field;
    this.setState({options: [1,2,3]})
  }

  updateSelect(e) {
    const field = this.props.select.field;
    const value = e.target.value
    this.props.updateSelect(field, value)
  }

  render() {
    const options = this.props.options ?
        this.props.options.map((option, i) => {
          return <option value={option} key={i}>{option}</option>
        })
      : null

    return (
      <select className='custom-select' onChange={this.updateSelect}>
        <option value='select'>{this.props.select.label}</option>
        { this.props.options ? options : null }
      </select>
    )
  }
}