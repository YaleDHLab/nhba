import React from 'react'

export default class SimplePage extends React.Component {
  constructor(props) {
    super(props)
    this.getStyle = this.getStyle.bind(this)
  }

  getStyle() {
    return {
      backgroundImage: 'url(' + this.props.image + ')'
    }
  }

  render() {
    return (
      <div className='simple-page'>
        <div className='hero'>
          <div className='background-image' style={this.getStyle()} />
        </div>
        <div className='container'>
          <h1 className='title'>{this.props.title}</h1>
          <div className='body-text'>{this.props.text.map((p, i) => {
            return <p key={i}>{p}</p>
          })}</div>
        </div>
      </div>
    )
  }
}