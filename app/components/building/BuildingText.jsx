import React from 'react'
import BuildingTable from './BuildingTable'

const fieldHrefs = {
  'description': 'overview',

}

export default class BuildingText extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='building-text'>
        <h1 className='address'>{this.props.building.address}</h1>

        <BuildingTable building={this.props.building} />

        {this.props.building && this.props.building.description ?
            this.props.fields.map((field, i) => {
              return (
                <section id={field.href} key={i}>
                  <div className='field'>
                    <h1 className='label'>{field.text.label}</h1>
                    <p className='text'>{this.props.building[field.text.field]}</p>
                  </div>
                </section>
              )
            })
          : <span>hm</span>
        }
      </div>
    )
  }
}