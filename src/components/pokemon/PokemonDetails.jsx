import React, { Component } from "react";
import Axios from "axios";
import styled from "styled-components";
import spinner from "../../images/spinner.gif";

const Sprite = styled.img`
  width: 15em;
  height: 15em;
  display: none;
  border: 2px solid black;
`;

const TYPE_COLORS = {
  bug: "B1C12E",
  dark: "4F3A2D",
  dragon: "755EDF",
  electric: "FCBC17",
  fairy: "F4B1F4",
  fighting: "823551D",
  fire: "E73B0C",
  flying: "A3B3F7",
  ghost: "6060B2",
  grass: "74C236",
  ground: "D3B357",
  ice: "A3E7FD",
  normal: "C8C4BC",
  poison: "934594",
  psychic: "ED4882",
  rock: "B9A156",
  steel: "B5B5C3",
  water: "3295F6",
};

export default class PokemonDetails extends Component {
  state = {
    name: "",
    experience: "",
    pokemonIndex: "",
    imageFrontUrl: "",
    imageBackUrl: "",
    imageFrontLoading: true,
    imageBackLoading: true,
    types: [],
    moves: [],
    description: "",
    statTitleWidth: 3,
    statBarWidth: 9,
    stats: {
      hp: "",
      attack: "",
      defence: "",
      speed: "",
      specialAttack: "",
      specialDefense: "",
    },
    height: "",
    weight: "",
    eggGroups: "",
    catchRate: "",
    abilities: "",
    evs: "",
    hatchSteps: "",
  };

  async componentDidMount() {
    const { pokemonIndex } = this.props.match.params;

    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

    const pokemonData = await Axios.get(pokemonUrl).catch((error) => {
      console.log("error", error);
    });

    const name = pokemonData.data.name;
    const experience = pokemonData.data.base_experience;
    const moves = pokemonData.data.moves;
    const imageFrontUrl = pokemonData.data.sprites.front_default;
    const imageBackUrl = pokemonData.data.sprites.back_default;

    let { hp, attack, defense, speed, specialAttack, specialDefense } = "";

    pokemonData.data.stats.map((stat) => {
      switch (stat.stat.name) {
        case "hp":
          hp = stat["base_stat"];
          break;
        case "attack":
          attack = stat["base_stat"];
          break;
        case "defense":
          defense = stat["base_stat"];
          break;
        case "speed":
          speed = stat["base_stat"];
          break;
        case "special-attack":
          specialAttack = stat["base_stat"];
          break;
        case "special-defense":
          specialDefense = stat["base_stat"];
          break;
        default:
          break;
      }
      return null;
    });

    const height = pokemonData.data.height / 10;
    const weight = pokemonData.data.weight / 10;

    const types = pokemonData.data.types.map((type) => type.type.name);

    const abilities = pokemonData.data.abilities
      .map((ability) => {
        return ability.ability.name
          .toLowerCase()
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ");
      })
      .join(", ");

    const evs = pokemonData.data.stats
      .filter((stat) => {
        if (stat.effort > 0) {
          return true;
        }
        return false;
      })
      .map((stat) => {
        return `${stat.effort} ${stat.stat.name
          .toLowerCase()
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ")}`;
      })
      .join(", ");

    await Axios.get(pokemonSpeciesUrl)
      .then((res) => {
        let description = "";
        res.data.flavor_text_entries.some((flavor) => {
          if (flavor.language.name === "en") {
            description = flavor.flavor_text;
            return 0;
          }
          return null;
        });

        const catchRate = Math.round((100 / 255) * res.data["capture_rate"]);

        const eggGroups = res.data["egg_groups"]
          .map((group) => {
            return group.name
              .toLowerCase()
              .split(" ")
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(" ");
          })
          .join(", ");

        const hatchSteps = 255 * (res.data["hatch_counter"] + 1);

        this.setState({
          description,
          catchRate,
          eggGroups,
          hatchSteps,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });

    this.setState({
      imageFrontUrl,
      imageBackUrl,
      pokemonIndex,
      name,
      experience,
      types,
      moves,
      stats: {
        hp,
        attack,
        defense,
        speed,
        specialAttack,
        specialDefense,
      },
      height,
      weight,
      abilities,
      evs,
    });
  }

  render() {
    return (
      <div className="col">
        <div className="card container details">
          <div className="card-header row justify-content-center">
            <div className="col-auto">
              <h3>
                {this.state.pokemonIndex}.{" "}
                {this.state.name
                  .toLowerCase()
                  .split(" ")
                  .map(
                    (word) => word.charAt(0).toUpperCase() + word.substring(1)
                  )}
              </h3>
            </div>
          </div>
          <div className="card-body-main row">
            <div className="pokemon-images col-md-6">
              <div className="row py-3 justify-content-center">
                {this.state.imageFrontLoading ? (
                  <img
                    src={spinner}
                    alt="spinner"
                    style={{ width: "15em", height: "15em" }}
                    className="rounded col-md-auto m-2"
                  />
                ) : null}
                <Sprite
                  className="rounded col-md-auto m-2"
                  src={this.state.imageFrontUrl}
                  onLoad={() => this.setState({ imageFrontLoading: false })}
                  style={
                    this.state.imageFrontLoading ? null : { display: "block" }
                  }
                />
                {this.state.imageBackLoading ? (
                  <img
                    src={spinner}
                    alt="spinner"
                    style={{ width: "15em", height: "15em" }}
                    className="rounded col-md-auto m-2"
                  />
                ) : null}
                <Sprite
                  className="rounded col-md-auto m-2"
                  src={this.state.imageBackUrl}
                  onLoad={() => this.setState({ imageBackLoading: false })}
                  style={
                    this.state.imageBackLoading ? null : { display: "block" }
                  }
                />
              </div>
            </div>
            <div className="pokemon-basic-info col-md-6 align-self-center">
              <div className="row">
                <div className="col4 mx-2">
                  <h4>Types:</h4>
                </div>
                <div className="col8">
                  <h4>
                    {this.state.types.map((type) => (
                      <span
                        key={type}
                        className="badge badge-primary mx-2"
                        style={{
                          backgroundColor: `#${TYPE_COLORS[type]}`,
                          color: "white",
                        }}
                      >
                        {type
                          .toUpperCase()
                          .split(" ")
                          .map(
                            (s) => s.charAt(0).toUpperCase() + s.substring(1)
                          )
                          .join(" ")}
                      </span>
                    ))}
                  </h4>
                </div>
              </div>
              <div
                className="row align-items-center"
                style={{ fontSize: "1rem" }}
              >
                <div className={`col-12 col-md-${this.state.statTitleWidth}`}>
                  HP:
                </div>
                <div className={`col-12 col-md-${this.state.statBarWidth}`}>
                  <div className="progress" style={{ height: "1rem" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                      role="progressbar"
                      style={{
                        width: `${this.state.stats.hp}%`,
                        fontSize: "1rem",
                      }}
                      aria-valuenow={this.state.stats.hp}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{this.state.stats.hp}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="row align-items-center"
                style={{ fontSize: "1rem" }}
              >
                <div className={`col-12 col-md-${this.state.statTitleWidth}`}>
                  Attack:
                </div>
                <div className={`col-12 col-md-${this.state.statBarWidth}`}>
                  <div className="progress" style={{ height: "1rem" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                      role="progressbar"
                      style={{
                        width: `${this.state.stats.attack}%`,
                        fontSize: "1rem",
                      }}
                      aria-valuenow={this.state.stats.attack}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{this.state.stats.attack}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="row align-items-center"
                style={{ fontSize: "1rem" }}
              >
                <div className={`col-12 col-md-${this.state.statTitleWidth}`}>
                  Defence:
                </div>
                <div className={`col-12 col-md-${this.state.statBarWidth}`}>
                  <div className="progress" style={{ height: "1rem" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                      role="progressbar"
                      style={{
                        width: `${this.state.stats.defense}%`,
                        fontSize: "1rem",
                      }}
                      aria-valuenow={this.state.stats.defence}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{this.state.stats.defense}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="row align-items-center"
                style={{ fontSize: "1rem" }}
              >
                <div className={`col-12 col-md-${this.state.statTitleWidth}`}>
                  Speed:
                </div>
                <div className={`col-12 col-md-${this.state.statBarWidth}`}>
                  <div className="progress" style={{ height: "1rem" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                      role="progressbar"
                      style={{
                        width: `${this.state.stats.speed}%`,
                        fontSize: "1rem",
                      }}
                      aria-valuenow={this.state.stats.speed}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{this.state.stats.speed}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="row align-items-center"
                style={{ fontSize: "1rem" }}
              >
                <div className={`col-12 col-md-${this.state.statTitleWidth}`}>
                  Special attack:
                </div>
                <div className={`col-12 col-md-${this.state.statBarWidth}`}>
                  <div className="progress" style={{ height: "1rem" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                      role="progressbar"
                      style={{
                        width: `${this.state.stats.specialAttack}%`,
                        fontSize: "1rem",
                      }}
                      aria-valuenow={this.state.stats.specialAttack}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{this.state.stats.specialAttack}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="row align-items-center"
                style={{ fontSize: "1rem" }}
              >
                <div className={`col-12 col-md-${this.state.statTitleWidth}`}>
                  Special defence:
                </div>
                <div className={`col-12 col-md-${this.state.statBarWidth}`}>
                  <div className="progress" style={{ height: "1rem" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                      role="progressbar "
                      style={{
                        width: `${this.state.stats.specialDefense}%`,
                        fontSize: "1rem",
                      }}
                      aria-valuenow={this.state.stats.specialDefense}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{this.state.stats.specialDefense}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="exp row justify-content-center">
            <h4 className="col-auto my-5" style={{ textAlign: "center" }}>
              Experience{" "}
              {this.state.name
                .toLowerCase()
                .split(" ")
                .map(
                  (word) => word.charAt(0).toUpperCase() + word.substring(1)
                )}{" "}
              gives you: {this.state.experience} points
            </h4>
          </div>
          <div className="description row justify-content-center mb-5">
            <h5
              className="col-auto"
              style={{ textAlign: "center", fontStyle: "italic" }}
            >
              {this.state.description}
            </h5>
          </div>
          <div className="card-body-extra row">
            <div className="extra-info col-md-6">
              <div className="row">
                <div className="col4 mx-2">
                  <h5>Height: {this.state.height} [m]</h5>
                </div>
                <div className="col8"></div>
              </div>
              <div className="row">
                <div className="col4 mx-2">
                  <h5>Weight: {this.state.weight} [kg]</h5>
                </div>
                <div className="col8"></div>
              </div>
              <div className="row">
                <div className="col4 mx-2">
                  <h5>Catch rate: {this.state.catchRate}%</h5>
                </div>
                <div className="col8"></div>
              </div>
              <div className="row">
                <div className="col4 mx-2">
                  <h5>Egg gropus: {this.state.eggGroups}</h5>
                </div>
                <div className="col8"></div>
              </div>
              <div className="row">
                <div className="col4 mx-2">
                  <h5>Abilities: {this.state.abilities}</h5>
                </div>
                <div className="col8"></div>
              </div>
              <div className="row">
                <div className="col4 mx-2">
                  <h5>EVS: {this.state.evs}</h5>
                </div>
                <div className="col8"></div>
              </div>
              <div className="row">
                <div className="col4 mx-2">
                  <h5>Hatch steps: {this.state.hatchSteps}</h5>
                </div>
                <div className="col8"></div>
              </div>
            </div>
            <h5 className="moves-list col-md-6 pl-2 pr-2 pb-2">
              Significant moves:{" "}
              {this.state.moves.map((move) => (
                <span key={move.move.name} className="badge badge-primary mr-2">
                  {move.move.name.toUpperCase()}
                </span>
              ))}
            </h5>
          </div>
        </div>
      </div>
    );
  }
}
