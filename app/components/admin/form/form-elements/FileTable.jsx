import React from 'react'

export default class FileTable extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const minusIconImage = '/assets/images/minus-icon'
    const minusIcon = (
      <object data={minusIconImage + '.svg'} type='image/svg+xml'>
        <img src={minusIconImage + '.png'} className='logo' />
      </object>
    )

    return (
      <div className='file-table'>
        <div className='label'>{this.props.label}</div>
        <div className='table'>
          <div className='table-row'>
            <div className='table-header left'>File Name</div>
            <div className='table-header right'>Document Title</div>
          </div>
          {this.props.files.map((file, i) => {
            return (
              <div className='table-row' key={i}>
                <div className='table-cell left'>
                  <div className='minus-icon'>{minusIcon}</div>
                  {file.filename}
                </div>
                <div className='table-cell right'>{file.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}