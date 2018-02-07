import React from "react";
import BuildingButton from "./BuildingButton";

export default class BuildingButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="building-buttons">
        {this.props.fields.map((field, i) => {
          return <BuildingButton field={field} key={i} />;
        })}
      </div>
    );
  }
}
