import React from 'react'
import {Link} from 'react-router'

export default class Card extends React.Component {
  constructor(props) {
    super(props)
  
    this.getStyle = this.getStyle.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.scrollTo = this.scrollTo.bind(this)
  }

  getStyle() {
    const dir = '/assets/uploads/resized/small';
    const filename = this.props.building.images.length > 0 ?
        this.props.building.images[0].filename
      : 'NA'
    const url = dir + '/' + filename;
    return {backgroundImage: 'url(' + url + ')'}
  }

  handleClick(e) {
    this.scrollTo(0, 150);
  }

  /**
  * Function to smooth scroll on a page
  *
  * @args:
  *   {int} to: the y position of document to which we should scroll
  *   {int} duration: the duration of the scroll
  * @returns:
  *   none
  **/

  scrollTo(to, duration) {
    const self = this;

    if (duration <= 0) return;
    const doc = document.documentElement;
    const scrolled = (window.pageYOffset || doc.scrollTop) -
        (doc.clientTop || 0);
    const difference = to - scrolled;
    const perTick = difference / duration * 10;

    setTimeout(function() {
      window.scrollTo(0, scrolled + perTick);
      if (scrolled + perTick === to) return;
      self.scrollTo(to, duration - 10);
    }, 10);
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
      <div className='card' onClick={this.handleClick}>
        <Link to={'/building?id=' + this.props.building._id + '#'}>
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
