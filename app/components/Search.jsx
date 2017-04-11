import React from 'react'
import Filters from './Filters'
import Cards from './Cards'
import Map from './Map'
import api from '../../config'

const selectFields = [
  'tour_ids',
  'building_types',
  'current_uses',
  'styles',
  'eras',
  'neighborhoods'
]

export default class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      buildings: [],
      tourIdToTitle: {},

      // select fields
      'tour_ids': new Set(),
      'building_types': new Set(),
      'current_uses': new Set(),
      'styles': new Set(),
      'eras': new Set(),
      'neighborhoods': new Set(),
      'sort': null
    }

    this.processBuildings = this.processBuildings.bind(this)
    this.processTours = this.processTours.bind(this)
    this.updateSelect = this.updateSelect.bind(this)
    this.runSearch = this.runSearch.bind(this)
  }

  componentDidMount() {
    api.get('buildings?images=true', this.processBuildings)
    api.get('wptours', this.processTours)
  }

  processBuildings(err, res) {
    if (err) { console.warn(err) } else {
      this.setState({buildings: res.body})
    }
  }

  processTours(err, res) {
    if (err) { console.warn(err) } else {
      let tourIdToTitle = {}
      let tourTitleToId = {}
      res.body.map((tour) => {
        tourIdToTitle[tour.tour_id] = tour.post_title
        tourTitleToId[tour.post_title] = tour.tour_id
      })

      this.setState({
        tourIdToTitle: tourIdToTitle,
        tourTitleToId: tourTitleToId
      })
    }
  }

  updateSelect(field, option) {
    let state = Object.assign({}, this.state)

    if (state[field].has(option)) {
      state[field].delete(option)
    } else {
      state[field].add(option)
    }

    this.setState(state, () => {
      this.runSearch()
    })
  }

  runSearch() {
    let queryTerms = {}
    selectFields.map((field) => {
      let values = Array.from(this.state[field])

      if (field == 'tour_ids') {
        let tourValues = []
        values.map((value) => {
          tourValues.push(this.state.tourTitleToId[value])
        })
        values = tourValues;
      }

      if (values.length > 0) {
        // Replace ' ' in values with _ so the server can handle whitespace
        var encodedValues = []
        values.map((value) => {

          // handle strings (all but the tour_ids are strings)
          if ((typeof value) == 'string') {
            encodedValues.push(value.split(' ').join('_'))
          } else {
            encodedValues.push(value)
          }
        })

        queryTerms[field] = encodedValues
      }
    })

    let url = 'buildings';

    if (queryTerms) {
      url += '?filter=true&'
      _.keys(queryTerms).map((field) => {
        url += field + '=' + queryTerms[field].join('+') + '&'
      })
    }

    api.get(url, this.processBuildings)
  }

  render() {
    return (
      <div className='search'>
        <Filters {...this.state}
          tourIdToTitle={this.state.tourIdToTitle}
          updateSelect={this.updateSelect} />
        <Cards buildings={this.state.buildings} />
        <Map buildings={this.state.buildings} />
      </div>
    )
  }
}
