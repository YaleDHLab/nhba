import React from 'react';
import User from './User';

export default class Users extends React.Component {
  render() {
    return (
      <div className="users">
        <div className="table">
          {this.props.users.map((user, i) => {
            return <User user={user} key={i} getUsers={this.props.getUsers} />;
          })}
        </div>
      </div>
    );
  }
}
