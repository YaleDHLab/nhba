import React from 'react'
import Card from './Card'
import _ from 'lodash'

export default class Cards extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cardsLoaded: 12
    }

    this.addCards = this.addCards.bind(this)
  }

  componentWillMount() {
    const self = this;
    this.handleScroll = _.debounce(function(event) {
      const windowHeight = window.innerHeight;
      const scrollDistance = document.querySelector('.cards').scrollTop;
      if (windowHeight - scrollDistance < 1000) self.addCards()
    }, 100)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (_.isEqual(nextProps.buildings, this.props.buildings) &&
        this.state.cardsLoaded === nextState.cardsLoaded) {
      return false;
    }
    return true;
  }

  addCards() {
    const cardsLoaded = this.state.cardsLoaded;
    this.setState({cardsLoaded: cardsLoaded + 12})
  }

  render() {
    return (
      <div className='cards' onScroll={this.handleScroll}>
        {_.take(this.props.buildings, this.state.cardsLoaded).map((building, i) => {
          return <Card key={i} building={building} />
        })}
      </div>
    )
  }
}
