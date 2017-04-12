import React from 'react'
import Form from './form/Form'
import LandingPage from './landing-page/LandingPage'

export default class Admin extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      view: 'landing-page'
    }
  }

  render() {
    let view = null;
    switch(this.state.view) {
      case 'form':
        view = <Form {...this.props} />
        break;

      case 'landing-page':
        view = <LandingPage {...this.props} />
        break;
    }

    return (
      <div className='admin'>
        {view}
      </div>
    )
  }
}
