import React from 'react'
import Tab from './Tab'

const tabs = [
  {
    key: 'overview',
    label: 'Overview',
    position: 'left'
  },
  {
    key: 'data-and-history',
    label: 'Data and History',
    position: 'center'
  },
  {
    key: 'image-gallery',
    label: 'Image Gallery',
    position: 'right'
  },
]

export default class Tabs extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='form-tabs'>    
        {tabs.map((tab, i) => {
          return <Tab key={i} {...this.props} tab={tab} />
        })}
      </div>
    )
  }
}