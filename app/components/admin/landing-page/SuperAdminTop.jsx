import React from 'react';
import Tabs from './tabs/Tabs';
import Pages from './Pages';
import Users from './Users';
import ViewAddBuildings from './ViewAddBuildings';
import api from '../../../../config';

const pages = [
  {
    label: 'About',
    route: '/admin/about'
  },
  {
    label: 'Contact',
    route: '/admin/contact'
  },
  {
    label: 'Glossary',
    route: '/admin/glossary'
  }
];

export default class SuperadminTop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 'users', // {'users' | 'pages'}
      users: []
    };

    this.changeTab = this.changeTab.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.processUsers = this.processUsers.bind(this);
  }

  changeTab(tab) {
    this.setState({ tab });
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers() {
    api.get('users', this.processUsers);
  }

  processUsers(err, res) {
    if (err) console.warn(err);
    this.setState({ users: res.body });
  }

  render() {
    const view =
      this.state.tab == 'users' ? (
        <Users users={this.state.users} getUsers={this.getUsers} />
      ) : (
        <Pages pages={pages} />
      );

    return (
      <div className="superadmin-top">
        <div className="left">
          <Tabs tab={this.state.tab} changeTab={this.changeTab} />
          {view}
        </div>

        <div className="right">
          <ViewAddBuildings />
        </div>
      </div>
    );
  }
}
