import React, { Component } from "react";

export default class SearchBar extends Component {
  state = {
    text: "",
  };

  handleChange = (event) => {
    this.setState({ text: event.target.value });
    this.props.filterPokemonsFunction(event.target.value);
  };

  render() {
    return (
      <React.Fragment>
        <div className="active-pink-3 active-pink-4 mb-4">
          <input
            value={this.state.text}
            onChange={this.handleChange}
            className="form-control"
            type="text"
            placeholder="Start typing a name..."
            aria-label="Search"
            style={{ fontSize: "2rem" }}
          />
        </div>
      </React.Fragment>
    );
  }
}
