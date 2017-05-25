import React from 'react'

export default class BuildingResources extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const archiveDocuments = this.props.building && this.props.building.archive_documents ?
        this.props.building.archive_documents.map((doc, i) => {
          return (
            <div className='archive-document' key={i}>
              <img src='/assets/images/link-icon.png' />
              <a href={'/assets/uploads/files/' + doc.filename}>{doc.label}</a>
            </div>
          )
        })
      : <span />

    const footnotes = this.props.building && this.props.building.footnotes ?
        <div className='footnotes'>{this.props.building.footnotes}</div>
      : <span />

    return (
      <div className='building-resources'>
        <h2>Documents</h2>
        {archiveDocuments}
        <h2>References</h2>
        {footnotes}
      </div>
    )
  }
} 
