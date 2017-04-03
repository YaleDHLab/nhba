import React from 'react'

export default class SuggestEdit extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='suggest-edit'>
        <a href='mailto:elihu.rubin@yale.edu?Subject=NHBA%20Editorial'
          target='_top'>Suggest an Edit</a>
        <div><b>Have something to add?</b> Contribute a fun fact or image to this building</div>
      </div>
    )
  }
}