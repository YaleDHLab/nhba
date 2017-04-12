import React from 'react'
import Tabs from './tabs/Tabs'
import Pages from './Pages'
import Users from './Users'
import Filters from '../../Filters'
import Search from '../../Search'
import api from '../../../../config'

const pages = [
  {
    label: 'About'
  },
  {
    label: 'Glossary'
  },
  {
    label: 'Contact'
  }
]

export default class LandingPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tab: 'users',  // {'users' | 'pages'}
      users: []
    }

    this.changeTab = this.changeTab.bind(this)
    this.processUsers = this.processUsers.bind(this)
  }

  changeTab(tab) {
    this.setState({tab: tab})
  }

  componentDidMount() {
    api.get('users', this.processUsers)
  }

  processUsers(err, res) {
    if (err) console.warn(err)
    this.setState({users: res.body})
  }

  render() {
    const view = this.state.tab == 'users' ?
        <Users users={this.state.users} />
      : <Pages pages={pages} />

    return (
      <div className='admin-landing-page'>
        <div className='top'>
          <div className='left'>
            <Tabs tab={this.state.tab} changeTab={this.changeTab} />
            {view}
          </div>

          <div className='right'>
            <div className='darker-shade' />
            <div className='right-container'>
              <h1>View Buildings</h1>
              <div className='admin-search-container'>
                <div className='admin-search-content'>
                  <input className='admin-search' placeholder='Search'></input>
                  <div className='admin-search-button'/>
                </div>
              </div>
              <div className='add-a-building'>Add a Building</div>
            </div>
          </div>
        </div>
        <div className='bottom'>
          <Search />
        </div>
      </div>
    )
  }
} 
