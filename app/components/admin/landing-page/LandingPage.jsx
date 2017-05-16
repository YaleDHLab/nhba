import React from 'react'
import SuperadminTop from './SuperadminTop'
import AdminTop from './AdminTop'
import Filters from '../../Filters'
import Search from '../../Search'
import api from '../../../../config'

export default class LandingPage extends React.Component {

  // Protect resources to which only superadmins have access
  render() {
    let top = null;
    api.get('session', (err, res) => {
      if (err) console.warn(err)
      top = res.body.session.superadmin ? <SuperadminTop /> : <AdminTop />
    })

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
