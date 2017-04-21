import React from 'react'
import Select from './form-elements/Select'
import TextArea from './form-elements/TextArea'
import TextInput from './form-elements/TextInput'
import FileTable from './form-elements/FileTable'
import FilePicker from './form-elements/FilePicker'
import request from 'superagent'
import api from '../../../../config'

export default class DataAndHistory extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      relabelFileIndex: null
    }

    this.handleFile = this.handleFile.bind(this)
    this.changeFileLabel = this.changeFileLabel.bind(this)
    this.selectFileToRelabel = this.selectFileToRelabel.bind(this)
  }

  /**
  * Method to select a file to relabel
  **/

  selectFileToRelabel(fileIndex) {
    this.setState({relabelFileIndex: fileIndex})
  }

  /**
  * Method to actually assign a new label to the file
  **/

  changeFileLabel(fileIndex, newLabel) {
    const archiveDocuments = this.props.building.archive_documents;
    let newArchiveDocuments = Object.assign([], archiveDocuments);
    newArchiveDocuments[fileIndex].label = newLabel;

    // use the replaceField method to quash the old archive documents
    this.props.replaceField('archive_documents', newArchiveDocuments);
  }

  /**
  * Method to save a file to the current building
  **/

  handleFile(e) {
    // remove the file we were relabelling (if any)
    this.setState({relabelFileIndex: null})

    var self = this;
    e.preventDefault();

    let files = [];
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    _.keys(files).map((k) => {
      var req = request.post(api.endpoint + 'upload');
      req.attach('image', files[k], files[k].name)

      req.end((err, res) => {
        if (err) console.log(err);

        const doc = {
          filename: res.body.file.name,
          label: res.body.file.name
        }

        self.props.updateField('archive_documents', doc)
      })
    })
  }

  render() {
    return (
      <div className='data-and-history'>

        <TextInput {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Historic Use'}
          field={'historicUse'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Past Tenants'}
          field={'previousTenants'} />

        <Select {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Street Visibility'}
          field={'streetVisibility'} />

        <Select {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Accessibility'}
          field={'accessibility'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Dimensions'}
          field={'dimensions'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'right'}
          label={'No. of Levels'}
          field={'levels'} />

        <Select {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Material'}
          field={'material'} />

        <Select {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Structure'}
          field={'structure'} />

        <Select {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Roof Type'}
          field={'roofType'} />

        <Select {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Roof Material'}
          field={'roofMaterial'} />

        <Select {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Structural Condition'}
          field={'structuralCondition'} />

        <Select {...this.props}
          width={'half-width'}
          position={'right'}
          label={'External Condition'}
          field={'externalCondition'} />

        <Select {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Threats'}
          field={'threats'} />

        <div className='clear-both' />

        <div className='row'>
          <h4>Building History</h4>
          <div className='style-guide'>Style guide...</div>
        </div>

        <TextArea {...this.props}
          width={'full-width'}
          label={'Physical Description'}
          field={'physicalDescription'}
          rows={7} />

        <TextArea {...this.props}
          width={'full-width'}
          label={'Streetscape'}
          field={'streetscape'}
          rows={7} />

        <TextArea {...this.props}
          width={'full-width'}
          label={'Social History'}
          field={'socialHistory'}
          rows={7} />

        <TextArea {...this.props}
          width={'full-width'}
          label={'Site History'}
          field={'siteHistory'}
          rows={7} />

        <FileTable {...this.props}
          files={this.props.building.archive_documents}
          label={'Archive Documents'}
          selectFileToRelabel={this.selectFileToRelabel} />

        <FilePicker {...this.props}
          topLabel={'Upload'}
          bottomLabel={'Display Title'}
          handleFile={this.handleFile}
          relabelFileIndex={this.state.relabelFileIndex}
          changeFileLabel={this.changeFileLabel} />

        <TextArea {...this.props}
          width={'full-width'}
          label={'Footnotes'}
          field={'footnotes'}
          rows={10} />

      </div>
    )
  }
}