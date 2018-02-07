import React from "react";
import getBuildingTable from "../lib/getBuildingTable";

export default class BuildingTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const rows = getBuildingTable(this.props.tableFields, this.props.building);

    return (
      <table className="building-table">
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
