import React from 'react'

export default class GlossaryItem extends React.Component {
  constructor(props) {
    super(props)

    this.deleteItem = this.deleteItem.bind(this)
    this.handleTermChange = this.handleTermChange.bind(this)
    this.handleDefinitionChange = this.handleDefinitionChange.bind(this)
  }

  handleTermChange(e) {
    this.props.handleTextChange(e, 'term', this.props.index)
  }

  handleDefinitionChange(e) {
    this.props.handleTextChange(e, 'definition', this.props.index)
  }

  deleteItem() {
    this.props.deleteItem(this.props.index)
  }

  render() {
    const rows = 5;

    return (
      <div className='glossary-item'>
        <textarea
          className='custom-textarea edit-glossary-term'
          onChange={this.handleTermChange}
          rows={rows}
          placeholder='Term name'
          value={this.props.item.term} />

        <textarea
          className='custom-textarea edit-glossary-definition'
          onChange={this.handleDefinitionChange}
          rows={rows}
          placeholder='Term definition'
          value={this.props.item.definition} />

        <img
          className='delete-icon'
          src='/assets/images/delete-icon.png'
          onClick={this.deleteItem} />
      </div>
    )
  }
} 



          