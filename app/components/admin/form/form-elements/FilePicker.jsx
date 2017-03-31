import React from 'react'

export default class FilePicker extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='file-picker'>
        <div className='label' />
        <div className='file-picker-content'>
          <div className='file-picker-row'>
            <div className='label'>{this.props.topLabel}</div>
            <input className='file-name-input' />
            <div className='file-name-button-container'>
              <div className='file-name-button'>Select File</div>
            </div>
          </div>
          <div className='file-picker-row'>
            <div className='label'>{this.props.bottomLabel}</div>
            <input className='file-display-name-input' />
          </div>
        </div>
      </div>
    )
  }
}