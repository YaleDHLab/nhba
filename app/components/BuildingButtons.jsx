import React from 'react'

const buttons = [
  {label: 'Overview', icon: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png'},
  {label: 'Building History', icon: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png'},
  {label: 'Structural Data', icon: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png'},
  {label: 'Community Stories', icon: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png'},
]

export default class BuildingButtons extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='building-buttons'>
        {buttons.map((button, i) => {
          return (
            <div className='building-button' key={i}>
              <div className='building-button-content'>
                <img src={button.icon} className='icon'/>
                <div className='label'>{button.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}