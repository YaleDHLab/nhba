import React from 'react'
import {Link} from 'react-router'

export default class Cards extends React.Component {
  constructor(props) {
    super(props)
  
    this.getStyle = this.getStyle.bind(this)
  }

  getStyle() {
    const url = this.props.building.resources[0].url;
    return {backgroundImage: 'url(' + url + ')'}
  }

  render() {
    const building = this.props.building;
    const label = this.props.label;

    return (
      <div className='card'>
        <Link to={'/building?id=' + building.buildingId}>
          <div className='card-content'>
            <div className='background-image card-image' style={this.getStyle()} />
            {label ?
                <div className='card-label'>{building[label]}</div>
              : null
            }
          </div>
        </Link>
      </div>
    )
  }
}
