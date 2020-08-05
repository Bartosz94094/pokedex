import React, { Component } from "react";
import axios from "axios";
import PokemonList from "../pokemon/PokemonList";
import SearchBar from "./SearchBar";
import logo from "../../images/pokemon.svg.png";

export default class Dashboard extends Component {
  state = {
    originalPokemons: null,
    checkingPokemons: null,
  };

  url = "https://pokeapi.co/api/v2/pokemon/?limit=200";

  async componentDidMount() {
    const res = await axios.get(this.url).catch((error) => {
      console.log("error", error);
    });
    this.setState({
      originalPokemons: res.data["results"],
      checkingPokemons: res.data["results"],
    });
  }

  debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  filterPokemons = this.debounce(function (word) {
    const newPokemons = this.state.originalPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(word.toLowerCase())
    );
    this.setState({ checkingPokemons: newPokemons });
  }, 250);

  render() {
    return (
      <div>
        <div className="row">
          <div className="col">
            <img src={logo} className="img-fluid mb-4" alt="pokemon" />
            <SearchBar
              filterPokemonsFunction={this.filterPokemons.bind(this)}
            ></SearchBar>
            <PokemonList pokemons={this.state.checkingPokemons}></PokemonList>
          </div>
        </div>
      </div>
    );
  }
}
