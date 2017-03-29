import React from 'react'
import Index from './index/Index'

export default class Admin extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='admin'>
        <Index />
      </div>
    )
  }
}
