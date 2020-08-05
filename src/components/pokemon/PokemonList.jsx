import React from "react";
import PokemonCard from "./PokemonCard";

export default function PokemonList({ pokemons }) {
  return (
    <React.Fragment>
      {pokemons ? (
        <div className="row">
          {pokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.name}
              name={pokemon.name}
              url={pokemon.url}
            ></PokemonCard>
          ))}
        </div>
      ) : (
        <h1
          className="database-loading"
          style={{ textAlign: "center", textShadow: "2px 2px black" }}
        >
          Pokemon database - loading
        </h1>
      )}
    </React.Fragment>
  );
}
