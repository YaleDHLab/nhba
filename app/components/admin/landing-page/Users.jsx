import React from 'react'

export default class Users extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='users'>
        <div className='table'>
          {this.props.users.map((user, i) => {
            return (
              <div className='row' key={i}>
                <div className='edit-icon' />
                {user.email}
                <div className='select-container'>
                  <select className='custom-select user-authorization'>
                    <option value='saab'>Contributor</option>
                    <option value='volvo'>Admin</option>
                  </select>
                  <div className='caret' />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
} 
