import React from 'react'
import SuperAdminTop from './SuperAdminTop'
import AdminTop from './AdminTop'
import Search from '../../Search'
import api from '../../../../config'

export default class LandingPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      superadmin: false
    }
  }

  componentWillMount() {
    const self = this;
    api.get('session', (err, res) => {
      if (err) console.warn(err)
      self.setState({superadmin: res.body.session.superadmin})
    })
  }

  render() {
    const top = this.state.superadmin ? <SuperAdminTop /> : <AdminTop />

    return (
      <div className='admin-landing-page'>
        <div className='top'>
          {top}
        </div>
        <div className='bottom'>
          <Search />
        </div>
      </div>
    )
  }
} 
