import React from 'react';
import Select from './form-elements/Select';
import TextInput from './form-elements/TextInput';
import RichTextArea from './form-elements/RichTextArea';
import request from 'superagent';
import _ from 'lodash';
import api from '../../../../config';

export default class DataAndHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileToRelabel: {}, // the file we're relabelling
    };

    // methods for handling building.archive_documents (file uploads)
    this.handleFile = this.handleFile.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.selectFileToRelabel = this.selectFileToRelabel.bind(this);
  }

  /**
   * Method to select a file to relabel
   **/

  selectFileToRelabel(fileIndex) {
    if (fileIndex != null) {
      let fileToRelabel = this.props.building.archive_documents[fileIndex];
      fileToRelabel.index = fileIndex;
      this.setState({ fileToRelabel: fileToRelabel });
    } else {
      // allow callers to specify null to remove the file to relabel
      this.setState({ fileToRelabel: null });
    }
  }

  /**
   * Method to actually assign a new label to the file
   **/

  handleLabelChange(e) {
    const relabelFileIndex = this.state.fileToRelabel.index;
    if (relabelFileIndex != 'null') {
      const newLabel = e.target.value;
      const archiveDocuments = this.props.building.archive_documents;

      // mutate a copy of the extant archive documents
      let newArchiveDocuments = Object.assign([], archiveDocuments);
      newArchiveDocuments[relabelFileIndex].label = newLabel;

      // use the replaceField method to quash the old archive documents
      this.props.replaceField('archive_documents', newArchiveDocuments);
    }
  }

  /**
   * Method to save a file to the current building
   **/

  handleFile(e) {
    // remove the file we were relabelling (if any)
    this.setState({ fileToRelabel: null });

    const self = this;
    e.preventDefault();

    let files = [];
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    _.keys(files).map(k => {
      let req = request.post(api.endpoint + 'upload');
      let filename = files[k].name.split(' ').join('-');
      req.attach('attachment', files[k], filename);

      req.end((err, res) => {
        if (err) console.warn(err);

        const doc = {
          filename: res.body.file.name,
          label: res.body.file.name,
        };

        self.props.updateField('archive_documents', doc);
      });
    });
  }

  render() {
    return (
      <div className="data-and-history">
        <Select
          {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Historic Use'}
          field={'historic_uses'}
        />

        <Select
          {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Street Visibility'}
          field={'street_visibilities'}
        />

        <Select
          {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Accessibility'}
          field={'accessibilities'}
        />

        <TextInput
          {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Dimensions'}
          field={'dimensions'}
        />

        <TextInput
          {...this.props}
          width={'half-width'}
          position={'left'}
          label={'No. of Levels'}
          field={'levels'}
        />

        <Select
          {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Materials'}
          field={'materials'}
        />

        <Select
          {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Structure'}
          field={'structures'}
        />

        <Select
          {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Roof Type'}
          field={'roof_types'}
        />

        <Select
          {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Roof Material'}
          field={'roof_materials'}
        />

        <Select
          {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Structural Condition'}
          field={'structural_conditions'}
        />

        <Select
          {...this.props}
          width={'half-width'}
          position={'left'}
          label={'External Condition'}
          field={'external_conditions'}
        />

        <Select
          {...this.props}
          width={'half-width'}
          position={'right'}
          label={'Threats'}
          field={'threats'}
        />

        <Select
          {...this.props}
          width={'half-width'}
          position={'left'}
          label={'Ownership Status'}
          field={'ownership_status'}
        />

        <div className="clear-both" />

        <RichTextArea
          {...this.props}
          width={'full-width'}
          label={'Past Tenants'}
          field={'past_tenants'}
          height={150}
        />

        <RichTextArea
          {...this.props}
          width={'full-width'}
          label={'Physical Description'}
          field={'physical_description'}
          placeholder={
            'Describe building form, materials, design, and style. Provide clear description of notable architectural features.  Note alterations and additions to the building made over time, both exterior and interior, when relevant. Highlight glossary terms.'
          }
          height={150}
        />

        <RichTextArea
          {...this.props}
          width={'full-width'}
          label={'Urban Setting'}
          field={'urban_setting'}
          placeholder={
            'Describe the urban context of your building. Standing alone in a field? In the midst of a dense commercial district? Comments and observations about the streetscape and general setting should go here. What role does your building play in this broader setting?'
          }
          height={150}
        />

        <RichTextArea
          {...this.props}
          width={'full-width'}
          label={'Social History'}
          field={'social_history'}
          placeholder={
            'Describe ownership and tenancy of the building over time. Draw from city directories, atlases, Sanborn maps, etc. Can you suggest the roles this building has played in the city’s broader social history?  What social groups or functions has it housed over time?'
          }
          height={150}
        />

        <RichTextArea
          {...this.props}
          width={'full-width'}
          label={'Site History'}
          field={'site_history'}
          placeholder={
            'More additional information on the history of this site, including ownership and land use prior to the current structure.'
          }
          height={150}
        />

        <RichTextArea
          {...this.props}
          width={'full-width'}
          label={'Sources'}
          field={'sources'}
          placeholder={
            'Please note sources, including maps, documents, and secondary sources.'
          }
          height={200}
        />
      </div>
    );
  }
}
