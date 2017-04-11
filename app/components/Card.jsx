import React from 'react'
import {Link} from 'react-router'

export default class Card extends React.Component {
  constructor(props) {
    super(props)
  
    this.getStyle = this.getStyle.bind(this)
  }

  getStyle() {
    const dir = '/assets/uploads/resized/small';
    const filename = this.props.building.images.length > 0 ?
        this.props.building.images[0].filename
      : 'NA'
    const url = dir + '/' + filename;
    return {backgroundImage: 'url(' + url + ')'}
  }

  getHtml(s) {
    return {__html: s};
  }

  render() {
    const building = this.props.building;
    const name = building.building_name ? building.building_name : building.address;

    // create the card details with available fields
    const neighborhood = building.neighborhoods ? building.neighborhoods[0] : ''
    const style = building.styles ? building.styles[0] : ''

    let details = '';
    if (neighborhood && style) {
      details = [neighborhood, style].join(' &#8226; ')
    } else {
      details = neighborhood ? neighborhood : style;
    }

    return (
      <div className='card'>
        <Link to={'/building?id=' + this.props.building._id}>
          <div className='card-content'>
            <div className='background-image card-image' style={this.getStyle()} />
            <div className='card-text'>
              <div className='card-name'>{name}</div>
              <div className='card-details'
                dangerouslySetInnerHTML={this.getHtml(details)} />
            </div>
          </div>
        </Link>
      </div>
    )
  }
}
