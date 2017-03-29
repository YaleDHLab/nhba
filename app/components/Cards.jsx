import React from 'react'
import Card from './Card'

export default class Cards extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='cards'>
        {this.props.buildings.map((building, i) => {
          return <Card key={i} building={building} />
        })}
      </div>
    )
  }
}
