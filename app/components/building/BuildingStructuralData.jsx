import React from 'react';
import BuildingTable from './BuildingTable';

const tableFields = [
  { label: 'Historic Use', field: 'historic_uses' },
  { label: 'Street Visibility', field: 'street_visibilities' },
  { label: 'Dimensions', field: 'dimensions' },
  { label: 'Material', field: 'materials' },
  { label: 'Roof Type', field: 'roof_types' },
  { label: 'Structural Condition', field: 'structural_conditions' },
  { label: 'Past Tenants', field: 'past_tenants' },
  { label: 'Accessibility', field: 'accessibilities' },
  { label: 'No. of levels', field: 'levels' },
  { label: 'Structure', field: 'structures' },
  { label: 'Roof Material', field: 'roof_materials' }
];

export default class BuildingStructuralData extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="building-structural-data">
        <BuildingTable
          building={this.props.building}
          tableFields={tableFields}
        />
      </div>
    );
  }
}
