import React from 'react'
import api from '../../../../config'
import request from 'superagent'

export default class User extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    let packet = {
      _id: this.props.user._id
    }

    if (e.target.value === 'admin') {
      packet.contributor = false;
      packet.admin = true;
    } else if (e.target.value === 'contributor') {
      packet.contributor = true;
      packet.admin = false;
    }

    request
      .post(api.endpoint + 'users/update')
      .send(packet)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) console.warn(err);

        // ask parent component to update user state
        this.props.getUsers();
      })
  }

  render() {
    return (
      <div className='row'>
        <div className='edit-icon' />
        {this.props.user.email}
        <div className='select-container'>
          <select className='custom-select user-authorization'
            value={this.props.user.admin ? 'admin' : 'contributor'}
            onChange={this.handleChange}>
            <option value='contributor'>Contributor</option>
            <option value='admin'>Admin</option>
          </select>
          <div className='caret' />
        </div>
      </div>
    )
  }
} 
