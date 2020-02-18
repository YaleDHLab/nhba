import React from 'react';
import Select from './form-elements/Select';
import TextInput from './form-elements/TextInput';
import RichTextArea from './form-elements/RichTextArea';

export default class Overview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="overview">
        <TextInput
          {...this.props}
          width="full-width"
          label="Building Name"
          field="building_name"
        />

        <TextInput
          {...this.props}
          width="full-width"
          label="Address*"
          field="address"
          onBlur={this.props.geocode}
        />

        <TextInput
          {...this.props}
          width="half-width"
          position="left"
          label="Latitude"
          field="latitude"
        />

        <TextInput
          {...this.props}
          width="half-width"
          position="right"
          label="Longitude"
          field="longitude"
        />

        <TextInput
          {...this.props}
          width="half-width"
          position="left"
          label="Year Built"
          field="year_built"
        />

        <Select
          {...this.props}
          width="half-width"
          position="right"
          label="Style"
          field="styles"
        />

        <Select
          {...this.props}
          width="half-width"
          position="left"
          label="Current Use*"
          field="current_uses"
        />

        <TextInput
          {...this.props}
          width="half-width"
          position="right"
          label="Current Tenant"
          field="current_tenant"
        />

        <Select
          {...this.props}
          width="half-width"
          position="left"
          label="Neighborhood"
          field="neighborhoods"
        />

        <Select
          {...this.props}
          width="half-width"
          position="right"
          label="Era"
          field="eras"
        />

        <TextInput
          {...this.props}
          width="half-width"
          position="left"
          label="Architect"
          field="architect"
        />

        <TextInput
          {...this.props}
          width="half-width"
          position="right"
          label="Client"
          field="client"
        />

        <TextInput
          {...this.props}
          width="half-width"
          position="left"
          label="Owner"
          field="owner"
        />

        <Select
          {...this.props}
          width="half-width"
          position="right"
          label="Related Outbuildings"
          field="related_outbuildings"
        />

        <Select
          {...this.props}
          width="half-width"
          position="left"
          label="Tour"
          field="tours"
        />

        <TextInput
          {...this.props}
          width="half-width"
          position="right"
          label="Researcher"
          field="researcher"
        />

        <RichTextArea
          {...this.props}
          width="full-width"
          label="Overview Description*"
          field="overview_description"
          placeholder="A pithy description of what a visitor to the building sees or should look for.  Summarize basic physical features, say something about its current use, and suggest some narrative or significance of the building.  Tone is engaging and conversational."
          height={250}
        />
      </div>
    );
  }
}
