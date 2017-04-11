import React from 'react'
import BuildingTable from './BuildingTable'

export default class BuildingText extends React.Component {
  constructor(props) {
    super(props)

    this.getMarkup = this.getMarkup.bind(this)
  }

  getMarkup(text) {
    return {__html: text.replace(/(?:\r\n|\r|\n)/g, '<br/> ')};
  }

  render() {
    const name = this.props.building.building_name ?
        this.props.building.building_name
      : this.props.building.address;

    return (
      <div className='building-text'>
        <h1 className='address'>{name}</h1>

        <BuildingTable building={this.props.building} />

        {this.props.building && this.props.building.overview_description ?
            this.props.fields.map((field, i) => {
              return (
                <section id={field.href} key={i}>
                  {this.props.building[field.text.field] ?
                      <div className='field'>
                        <h1 className='label'>{field.text.label}</h1>
                        <p className='text'
                          dangerouslySetInnerHTML={this.getMarkup(this.props.building[field.text.field])} />
                      </div>
                    : null
                  }
                </section>
              )
            })
          : <span>Sorry, this building could not be loaded.</span>
        }
      </div>
    )
  }
}