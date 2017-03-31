import React from 'react'

const files = [
  {
    name: 'building.pdf',
    title: '1879 Blueprint'
  },
  {
    name: 'File Name.pdf',
    title: 'Author title here'
  },
  {
    name: 'File Name.pdf',
    title: 'Author title here'
  }
]

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
          {files.map((file, i) => {
            return (
              <div className='table-row' key={i}>
                <div className='table-cell left'>
                  <div className='minus-icon'>{minusIcon}</div>
                  {file.name}
                </div>
                <div className='table-cell right'>{file.title}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}