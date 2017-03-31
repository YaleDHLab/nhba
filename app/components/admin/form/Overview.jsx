import React from 'react'
import Select from './form-elements/Select'
import TextArea from './form-elements/TextArea'
import TextInput from './form-elements/TextInput'

export default class Overview extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='overview'>

        <TextInput {...this.props}
          width={'full-width'}
          label={'Building Name'}
          field={'buildingName'} />

        <TextInput {...this.props}
          width={'full-width'}
          label={'Address'}
          field={'buildingName'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Year Built'}
          field={'yearBuilt'} />

        <Select {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Style'}
          field={'style'} />

        <Select {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Current Use'}
          field={'currentUse'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Current Tenant'}
          field={'currentTenant'} />

        <Select {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Neighborhood'}
          field={'neighborhood'} />

        <Select {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Era'}
          field={'era'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Architect'}
          field={'architect'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Client'}
          field={'client'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Owner'}
          field={'owner'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Status'}
          field={'status'} />

        <Select {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Tour'}
          field={'tour'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Researcher'}
          field={'researcher'} />

        <TextArea {...this.props}
          width={'full-width'}
          label={'Overview Description'}
          field={'description'}
          rows={20} />

        <TextInput {...this.props}
          width={'full-width'}
          label={'Story Map Url'}
          field={'storymapUrl'} />

      </div>
    )
  }
}