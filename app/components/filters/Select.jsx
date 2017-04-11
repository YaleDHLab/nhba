import React from 'react'
import api from '../../../config'

export default class Select extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      active: false
    }

    this.handlePageClick = this.handlePageClick.bind(this) // closes select boxes
    this.toggleView = this.toggleView.bind(this) // toggles select dropdown
    this.getSelectClass = this.getSelectClass.bind(this)
    this.getDecoyClass = this.getDecoyClass.bind(this)
    this.selectClicked = this.selectClicked.bind(this)
    this.inputClicked = this.inputClicked.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handlePageClick, false)
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handlePageClick, false)
  }

  getSelectClass() {
    return this.state.active ? 'multiselect active' : 'multiselect';
  }

  getDecoyClass() {
    return 'select-decoy ' + this.props.select.field;
  }

  handlePageClick(e) {
    if (this.selectClicked(e) || this.inputClicked(e)) {} else {
      this.setState({active: false})
    }
  }

  selectClicked(e) {
    return e.target.className == this.getDecoyClass() ? true : false;
  }

  inputClicked(e) {
    const tagName = e.target.tagName;
    return tagName == 'INPUT' || tagName == 'LABEL' ? true : false;
  }

  toggleView(e) {
    if (this.selectClicked(e)) {
      const active = this.state.active ? false : true;
      this.setState({active: active})
    }
  }

  handleCheckbox(e) {
    const option = e.target.id;
    this.props.updateSelect(this.props.select.field, option)
  }

  render() {
    const options = this.props.options ?
        this.props.options.map((option, i) => {
          const value = _.includes(this.props.values, option) ? true : false;
          return (
            <label key={i}>
              <input
                type='checkbox'
                id={option}
                checked={value}
                onChange={this.handleCheckbox} />
              {option}
            </label>
          )
        })
      : null

    return (
      <div className={this.getSelectClass()} onClick={this.toggleView}>
        <div className='select-box' onClick={this.showOptions}>
          <select className='custom-select'>
            <option>{this.props.select.label}</option>
          </select>
          <div className={this.getDecoyClass()}></div>
        </div>
        <div className='select-checkboxes'>
          {options}
        </div>
      </div>
    )
  }
}