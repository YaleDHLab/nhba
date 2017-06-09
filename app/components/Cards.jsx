import React from 'react'
import Card from './Card'
import _ from 'lodash'

export default class Cards extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cardsLoaded: window.innerWidth < 600 ? 5 : 12,
      cardsPerLoad: window.innerWidth < 600 ? 5 : 12
    }

    this.addCards = this.addCards.bind(this)
  }

  componentWillMount() {
    const self = this;
    this.handleScroll = _.debounce(function(event) {
      const cards = document.querySelector('.cards');
      if (!cards) return;
      if (cards.clientHeight - cards.scrollTop < 300) self.addCards()
    }, 200)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return _.isEqual(nextProps.buildings, this.props.buildings) &&
          this.state.cardsLoaded === nextState.cardsLoaded ?
        false
      : true
  }

  addCards() {
    const cardsLoaded = this.state.cardsLoaded;
    this.setState({cardsLoaded: cardsLoaded + this.state.cardsPerLoad})
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
