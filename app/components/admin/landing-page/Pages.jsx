import React from 'react'

export default class Pages extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='pages'>
        <div className='table'>
          {this.props.pages.map((page, i) => {
            return (
              <div className='row' key={i}>
                <div className='edit-icon' />
                {page.label}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
} 
