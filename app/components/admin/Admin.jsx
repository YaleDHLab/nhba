import React from 'react'
import Form from './form/Form'

export default class Admin extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      view: 'form'
    }
  }

  switchView(view) {
    this.setState({view: view})
  }

  render() {
    let view = null;
    switch(this.state.view) {
      case 'form':
        view = <Form {...this.props} />
        break;
    }

    return (
      <div className='admin'>
        {view}
      </div>
    )
  }
}
