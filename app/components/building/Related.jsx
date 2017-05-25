import React from 'react'
import Card from '../Card'
import api from '../../../config'

export default class Related extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      buildings: []
    }

    this.processBuildings = this.processBuildings.bind(this)
  }

  componentDidMount() {
    api.get('buildings', this.processBuildings)
  }

  processBuildings(err, res) {
    if (err) { console.warn(err) } else {
      const buildings = res.body;
      this.setState({buildings: buildings})
    }
  }

  render() {
    return (
      <div className='related'>
        <div className='related-buildings'>
          {this.state.buildings.length > 0 ?
            _.take(this.state.buildings, 8).map((building, i) => {
              return (<Card building={building} key={i} label={'address'} />)
            })
            : null
          }
        </div>
      </div>
    )
  }
}