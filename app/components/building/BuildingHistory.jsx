import React from 'react';
import getNewlineMarkup from '../lib/getNewlineMarkup';

const buildingHistoryFields = [
  { field: 'physical_description', label: 'Physical Description' },
  { field: 'urban_setting', label: 'Urban Setting' },
  { field: 'social_history', label: 'Social History' },
  { field: 'site_history', label: 'Site History' },
];

export default class BuildingHistory extends React.Component {
  render() {
    return (
      <div className="building-history">
        {buildingHistoryFields.map((field, i) => {
          return this.props.building && this.props.building[field.field] ? (
            <div key={i}>
              <h3 className="subfield">{field.label}</h3>
              <div
                dangerouslySetInnerHTML={getNewlineMarkup(
                  this.props.building[field.field]
                )}
              />
            </div>
          ) : null;
        })}
      </div>
    );
  }
}
