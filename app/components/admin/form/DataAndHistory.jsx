import React from 'react'
import Select from './form-elements/Select'
import TextArea from './form-elements/TextArea'
import TextInput from './form-elements/TextInput'
import FileTable from './form-elements/FileTable'
import FilePicker from './form-elements/FilePicker'

export default class DataAndHistory extends React.Component {
  constructor(props) {
    super(props)
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
          label={'Archive Documents'} />

        <FilePicker {...this.props}
          topLabel={'Upload'}
          bottomLabel={'Display Title'} />

        <TextArea {...this.props}
          width={'full-width'}
          label={'Footnotes'}
          field={'footnotes'}
          rows={10} />

      </div>
    )
  }
}