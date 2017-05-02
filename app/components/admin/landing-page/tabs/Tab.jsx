import React from 'react'

export default class Tab extends React.Component {
  constructor(props) {
    super(props)

    this.getClass = this.getClass.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  getClass() {
    const defaultClass = 'tab';
    return this.props.tab.value == this.props.activeTab ?
        defaultClass + ' ' + 'active'
      : defaultClass
  }

  handleClick() {
    this.props.changeTab(this.props.tab.value)
  }

  render() {
    return (
      <div className={this.getClass()} onClick={this.handleClick}>
        {this.props.tab.label}
      </div>
    )
  }
} 
