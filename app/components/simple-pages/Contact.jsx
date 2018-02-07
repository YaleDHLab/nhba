import React from "react";
import SimplePage from "./SimplePage";

export default class Contact extends React.Component {
  render() {
    const page = {
      image: "/assets/images/new-haven-overhead.jpg",
      title: "Contact",
      route: "contact",
      flat: true,
    };

    return (
      <div className="contact">
        <SimplePage {...page} />
      </div>
    );
  }
}
