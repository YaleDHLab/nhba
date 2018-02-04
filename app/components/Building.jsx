import React from "react";
import LayoutToggle from "./building/BuildingLayoutToggle";
import BuildingButtons from "./building/BuildingButtons";
import BuildingEditButton from "./building/BuildingEditButton";
import Gallery from "./building/BuildingGallery";
import Related from "./building/Related";
import Loader from "./Loader";
import Map from "./Map";

// helpers
import api from "../../config";

// Building Text components
import BuildingText from "./building/BuildingText";
import BuildingTextBox from "./building/BuildingTextBox";
import BuildingHistory from "./building/BuildingHistory";
import BuildingStructuralData from "./building/BuildingStructuralData";
import BuildingResources from "./building/BuildingResources";

export default class Building extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      building: {},
      layout: { left: "Map", right: "Gallery" },
      admin: false,
      creator: false,

      // tour data for mapping
      tourNameToIndex: {}
    };

    this.toggleLayout = this.toggleLayout.bind(this);

    // getter for the text fields for a building
    this.getTextFields = this.getTextFields.bind(this);

    // getter and setter for building data
    this.getBuilding = this.getBuilding.bind(this);
    this.processBuilding = this.processBuilding.bind(this);

    // getter and setter for user admin status
    this.checkUserStatus = this.checkUserStatus.bind(this);
    this.processUserStatus = this.processUserStatus.bind(this);

    // getter and setter for building creator status
    this.checkCreatorStatus = this.checkCreatorStatus.bind(this);
    this.processCreatorStatus = this.processCreatorStatus.bind(this);
  }

  componentDidMount() {
    this.getBuilding();
    this.checkUserStatus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.query.id != prevProps.location.query.id) {
      this.getBuilding();
    }
  }

  /**
   * Getters and setters for the requested building
   **/

  getBuilding() {
    if (this.props.location.query.id) {
      const buildingId = this.props.location.query.id;
      api.get("buildings?buildingId=" + buildingId, this.processBuilding);
    } else if (this.props.location.query.random === "true") {
      api.get("buildings/random", this.processBuilding);
    }
  }

  processBuilding(err, res) {
    if (err) {
      console.warn(err);
    } else {
      this.setState({ building: res.body[0] });
      this.checkCreatorStatus(res.body[0]._id);
    }
  }

  /**
   * Check whether the user is an admin or not
   **/

  checkUserStatus() {
    api.get("session", this.processUserStatus);
  }

  processUserStatus(err, res) {
    if (err) console.warn(err);
    if (res.body.session.admin === true) {
      this.setState({ admin: true });
    }
  }

  /**
   * Check whether the user is the creator of the building or not
   **/

  checkCreatorStatus(buildingId) {
    api.get("creator?buildingId=" + buildingId, this.processCreatorStatus);
  }

  processCreatorStatus(err, res) {
    if (err) console.warn(err);
    if (res.body.creator === true) {
      this.setState({ creator: true });
    }
  }

  /**
   * Allow users to swap building and map positions
   **/

  toggleLayout() {
    this.state.layout.left === "Map"
      ? this.setState({ layout: { left: "Gallery", right: "Map" } })
      : this.setState({ layout: { left: "Map", right: "Gallery" } });
  }

  /**
   * Retrieve the fields required for creating building table and action buttons
   **/

  getTextFields() {
    const building = this.state.building;
    if (!building) return;

    const fields = [
      {
        label: "Overview",
        button: { label: "Overview", icon: "overview" },
        href: "description",
        collapsible: false,
        contentFields: ["overview_description"],
        component: (
          <BuildingTextBox
            title="Overview"
            text={building.overview_description}
          />
        )
      },
      {
        label: "Physical Description",
        button: { label: "Physical Description", icon: "building" },
        href: "physical-description",
        collapsible: false,
        contentFields: ["physical_description"],
        component: (
          <BuildingTextBox
            title="Physical Description"
            text={building.physical_description}
          />
        )
      },
      {
        label: "Urban Setting",
        button: { label: "Urban Setting", icon: "building" },
        href: "urban-setting",
        collapsible: false,
        contentFields: ["urban_setting"],
        component: (
          <BuildingTextBox
            title="Urban Setting"
            text={building.urban_setting}
          />
        )
      },
      {
        label: "Social History",
        button: { label: "Social History", icon: "building" },
        href: "social-history",
        collapsible: false,
        contentFields: ["social_history"],
        component: (
          <BuildingTextBox
            title="Social History"
            text={building.social_history}
          />
        )
      },
      {
        label: "Site History",
        button: { label: "Site History", icon: "building" },
        href: "site-history",
        collapsible: false,
        contentFields: ["site_history"],
        component: (
          <BuildingTextBox title="Site History" text={building.site_history} />
        )
      },
      {
        label: "Structural Data",
        button: { label: "Structural Data", icon: "structure" },
        href: "structuralData",
        component: <BuildingStructuralData building={building} />,
        collapsible: true,
        contentFields: [
          "historic_uses",
          "street_visibilities",
          "dimensions",
          "materials",
          "roof_types",
          "structural_conditions",
          "past_tenants",
          "accessibilities",
          "levels",
          "structures",
          "roof_materials"
        ]
      },
      {
        label: "Resources",
        button: { label: "Resources", icon: "community" },
        href: "resources",
        component: <BuildingResources building={building} />,
        collapsible: true,
        contentFields: ["archive_documents", "sources"]
      }
    ];

    // only return fields if one or more of their contentFields are populated
    // in the current building
    let extantFields = [];
    fields.map(field => {
      let kept = false;
      field.contentFields.map(contentField => {
        if (building[contentField] && building[contentField].length && !kept) {
          extantFields.push(field);
          kept = true;
        }
      });
    });

    return extantFields;
  }

  /**
   * Main render function
   **/

  render() {
    const building = this.state.building;
    const location =
      building && building.latitude && building.longitude
        ? {
            lat: parseFloat(building.latitude),
            lng: parseFloat(building.longitude)
          }
        : null;

    const map =
      this.state.tourNameToIndex && building ? (
        <Map
          buildings={[this.state.building]}
          tourNameToIndex={this.state.tourNameToIndex}
          initialLocation={location}
        />
      ) : (
        <Loader />
      );

    const layout = {
      Map: map,
      Gallery: (
        <Gallery building={this.state.building} layout={this.state.layout} />
      )
    };

    const fields = this.getTextFields();

    return (
      <div className="building">
        <div className="building-content">
          <div className="top">
            <div className="left">
              <div className="left-content">
                <div className="top-left-top">
                  {layout[this.state.layout.left]}
                </div>
                <div className="top-left-bottom">
                  <LayoutToggle
                    toggleLayout={this.toggleLayout}
                    layout={this.state.layout}
                  />
                  <BuildingButtons fields={fields} {...this.props} />
                  <BuildingEditButton
                    admin={this.state.admin}
                    creator={this.state.creator}
                    building={this.state.building}
                  />
                </div>
              </div>
              <div className="bottom">
                <h1 className="label">Related Buildings</h1>
                <Related building={this.state.building} />
              </div>
            </div>
            <div className="right">
              <div className="top-right-top">
                {layout[this.state.layout.right]}
              </div>
              <div className="top-right-bottom">
                <BuildingText building={this.state.building} fields={fields} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
