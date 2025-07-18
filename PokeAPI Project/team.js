import { loadStorage, saveStorage } from "./util.js"

let nameDisplay = document.querySelector('#display_name');

let displayTeam = () => {

    let session = loadStorage('session');
    let team = session[2];

    nameDisplay.textContent = `${session[1]}'s Team`;

    let teamDiv = document.querySelector('.team');
    teamDiv.innerHTML = '';

    team.forEach(pokemon => {
        let pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemonDiv');
        
        let pokemonNameEl = document.createElement('div');
        pokemonNameEl.classList.add('pokemonName');
        pokemonNameEl.textContent = capitalizeFirstLetter(pokemon.name);
        pokemonDiv.appendChild(pokemonNameEl);

        let pokemonImageDiv = document.createElement('div');
        pokemonImageDiv.classList.add('pokemonImageDiv');

        let pokemonImageEl = document.createElement('img');
        pokemonImageEl.src = pokemon.imageURL;
        
        pokemonImageDiv.appendChild(pokemonImageEl)
        pokemonDiv.appendChild(pokemonImageDiv);

        let pokemonAbilityEl = document.createElement('div');
        pokemonAbilityEl.classList.add('pokemonAbility');
        pokemonAbilityEl.textContent = capitalizeFirstLetter(pokemon.ability);
        pokemonDiv.appendChild(pokemonAbilityEl);

        let pokemonTypesEl = document.createElement('div');
        pokemonTypesEl.classList.add('pokemonTypes');
        pokemon.types.forEach(typeInfo => {
            const typeName = typeInfo;

            const typeEl = document.createElement('div');
            typeEl.classList.add('type-badge', `type-${typeName}`);
            typeEl.textContent = typeName;
            pokemonTypesEl.appendChild(typeEl);
        })
        pokemonDiv.appendChild(pokemonTypesEl);

        let removePokemonBtn = document.createElement('button');
        removePokemonBtn.textContent = 'Remove';
        removePokemonBtn.classList.add('remove-pokemon');
        removePokemonBtn.addEventListener('click', () => {
            let answer = window.confirm('Are you sure you want to remove this pokemon from your party?');
            if(answer) {
                removePokemon(pokemon.id);
            } else {
                return;
            }
        });
        pokemonDiv.appendChild(removePokemonBtn);

        teamDiv.appendChild(pokemonDiv);
    });
}

let removePokemon = (id) => {
    let session = loadStorage('session');
    let team = session[2];

    const pokemonIndex = team.findIndex(pokemon => pokemon.id === id);
    team.splice(pokemonIndex, 1);

    const newSession = [session[0], session[1], team];
    saveStorage('session', newSession);
    displayTeam();

}

function capitalizeFirstLetter(word) {
    if (word.length === 0) {
        return "";
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
}

document.addEventListener('DOMContentLoaded', () => {

    displayTeam();
})