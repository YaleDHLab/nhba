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
          field={'building_name'} />

        <TextInput {...this.props}
          width={'full-width'}
          label={'Address'}
          field={'address'}
          onBlur={this.props.geocode} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Latitude'}
          field={'latitude'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Longitude'}
          field={'longitude'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Year Built'}
          field={'year_built'} />

        <Select {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Style'}
          field={'styles'} />

        <Select {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Current Use'}
          field={'current_uses'} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Current Tenant'}
          field={'current_tenant'} />

        <Select {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Neighborhood'}
          field={'neighborhoods'} />

        <Select {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Era'}
          field={'eras'} />

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
          field={'tour_ids'}
          valueMap={this.props.tourIdToTitle} />

        <TextInput {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Researcher'}
          field={'researcher'} />

        <TextArea {...this.props}
          width={'full-width'}
          label={'Overview Description'}
          field={'overview_description'}
          rows={20} />

        <TextInput {...this.props}
          width={'full-width'}
          label={'Story Map Url'}
          field={'storymap_url'} />

      </div>
    )
  }
}