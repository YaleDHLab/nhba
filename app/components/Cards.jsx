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
      const cards = document.querySelector('.cards');
      if (!cards) return;
      const scrollDistance = cards.scrollTop;
      if (window.innerHeight - scrollDistance < 1000) self.addCards()
    }, 50)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return _.isEqual(nextProps.buildings, this.props.buildings) &&
          this.state.cardsLoaded === nextState.cardsLoaded ?
        false
      : true
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
