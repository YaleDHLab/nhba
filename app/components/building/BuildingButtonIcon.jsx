import React from 'react';
import IconBuilding from './icons/IconBuilding';
import IconCommunity from './icons/IconCommunity';
import IconOverview from './icons/IconOverview';
import IconStructure from './icons/IconStructure';

export default class BuidingButtonIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const icons = {
      building: <IconBuilding />,
      community: <IconCommunity />,
      overview: <IconOverview />,
      structure: <IconStructure />
    };

    return <span>{icons[this.props.icon]}</span>;
  }
}
