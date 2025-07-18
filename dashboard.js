import { saveStorage, loadStorage, checkSession } from "./util.js";





let pokemonBtn = document.querySelector('.pokemon_btn');
let logoutBtn = document.querySelector('.logout');
let pokemonInput = document.querySelector('.pokemon_input');
let pokemonImage = document.querySelector('.pokemon_image');
let typesContainer = document.querySelector('.types');
let pokemonName = document.querySelector('.name');
let pokemonHeightWeight = document.querySelector('.height_weight');
let pokemonStats = document.querySelector('.base_stats');
let pokemonDexEntry = document.querySelector('.entry');
let pokemonAbility = document.querySelector('.abilities');
let pokemonCry = document.querySelector('.pokemon_cry');
let pokemonAddTeamDiv = document.querySelector('.button_div');

let session = loadStorage('session');
let trainers = loadStorage('trainers');
let team = session[2];

let url = 'https://pokeapi.co/api/v2/pokemon/';

pokemonBtn.addEventListener('click', () => {
    let endpoint = `${url}${pokemonInput.value}`;

    async function fetchPokemon() {
        try {
            let response = await fetch(endpoint, {cache: 'no-cache'});

            if (!response.ok) {
                throw new Error('Cannot fetch pokemon.');
            }

            let pokemon = await response.json();
            
            // Displayfication

            // Image
            pokemonImage.src = pokemon.sprites.front_default;

            // Types
            typesContainer.innerHTML = '';
            const typeLabel = document.createElement('h1');
            typeLabel.classList.add('ability-label');
            typeLabel.textContent = 'Types';
            typesContainer.appendChild(typeLabel);

            let pokemonTypes = [];

            pokemon.types.forEach(typeInfo => {
                const typeName = typeInfo.type.name;

                pokemonTypes.push(typeName);

                const typeEl = document.createElement('div');
                typeEl.classList.add('type-badge', `type-${typeName}`);
                typeEl.textContent = typeName;
                typesContainer.appendChild(typeEl);
            })

            // Abilities
            pokemonAbility.innerHTML = '';

            const abilityLabel = document.createElement('h1');
            abilityLabel.classList.add('ability-label');
            abilityLabel.textContent = 'Ability';
            pokemonAbility.appendChild(abilityLabel);

            pokemon.abilities.forEach(abilityInfo => {
                const abilityEl = document.createElement('div');
                abilityEl.classList.add('ability-badge');
                abilityEl.textContent = abilityInfo.ability.name;
                
                pokemonAbility.appendChild(abilityEl);
            })

            // Name
            pokemonName.textContent = capitalizeFirstLetter(pokemon.name);
            
            // Height and Weight
            pokemonHeightWeight.innerHTML = '';
            const detailsLabel = document.createElement('h1');
            detailsLabel.classList.add('ability-label');
            detailsLabel.textContent = 'Height & Weight';
            pokemonHeightWeight.appendChild(detailsLabel);

            const heightDiv = document.createElement('div');
            const weightDiv = document.createElement('div');

            heightDiv.classList.add('height_weight-badge', 'heightDiv');
            weightDiv.classList.add('height_weight-badge', 'weightDiv');

            heightDiv.textContent = pokemon.height / 10 + 'm';
            weightDiv.textContent = pokemon.weight / 10 + 'kg';

            pokemonHeightWeight.appendChild(heightDiv);
            pokemonHeightWeight.appendChild(weightDiv);

            // Base Stats
            pokemonStats.innerHTML = '';
            const statsLabel = document.createElement('h1');
            statsLabel.classList.add('ability-label');
            statsLabel.textContent = 'Base Stats';
            pokemonStats.appendChild(statsLabel);

            const statNameMapping = {
                'hp': 'HP',
                'attack': 'Atk',
                'defense': 'Def',
                'special-attack': 'SpA',
                'special-defense': 'SpD',
                'speed': 'Spe'
            };

            pokemon.stats.forEach(stat => {
                const statRow = document.createElement('div');
                statRow.classList.add('stat-row');

                const statName = document.createElement('span');
                statName.classList.add('stat-name');
                statName.textContent = statNameMapping[stat.stat.name] || stat.stat.name;

                const barContainer = document.createElement('div');
                barContainer.classList.add('stat-bar-container');

                const bar = document.createElement('div');
                bar.classList.add('stat-bar');

                const baseStat = stat.base_stat;
                const maxStat = 255;
                const widthPercent = (baseStat / maxStat) * 100;
                bar.style.width = `${widthPercent}%`;
                
                if (baseStat < 60) {
                    bar.classList.add('stat-low');
                } else if (baseStat < 100) {
                    bar.classList.add('stat-medium');
                } else {
                    bar.classList.add('stat-high');
                }

                barContainer.appendChild(bar);
                statRow.appendChild(statName);
                statRow.appendChild(barContainer);
                pokemonStats.appendChild(statRow);
            });

            // Cry
            pokemonCry.src = `${pokemon.cries.latest}`;
            pokemonCry.setAttribute('autoplay', '');

            // Pokedex Entry
            pokemonDexEntry.innerHTML = '';
            const entryLabel = document.createElement('h1');
            entryLabel.classList.add('ability-label');
            entryLabel.textContent = 'Description';
            pokemonDexEntry.appendChild(entryLabel);

            const entryMessage = document.createElement('div');
            entryMessage.classList.add('entry-message');
            
            let fetchPokemonSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
            let fetchPokemonDexEntry = await fetchPokemonSpecies.json();
            
            let fetchPokemonDescription = fetchPokemonDexEntry.flavor_text_entries.find(entry => entry.language.name === 'en');
            entryMessage.textContent = fetchPokemonDescription ? fetchPokemonDescription.flavor_text.replace(/\f/g, ' ') : 'No description available.';

            pokemonDexEntry.appendChild(entryMessage);
            pokemonAddTeamDiv.innerHTML = '';
            pokemonAddTeamDiv.innerHTML = `
                <div id="button_div">
                    <button id="addToTeamBtn">Add to Team</button>
                </div>
            `;

            // Add to team functionality            
            let currentPokemon = {
                id: Date.now(),
                trainer: session[1],
                imageURL: pokemon.sprites.front_default,
                name: pokemon.name,
                types: pokemonTypes,
                ability: pokemon.abilities[0].ability.name
            }

            let addToTeamBtn = document.querySelector('#addToTeamBtn');
            addToTeamBtn.addEventListener('click', () => {
                if (team.length + 1 < 7) {
                    alert(`Added ${currentPokemon.name} successfully!`);
                    team.push(currentPokemon);
                    console.log(team);

                    const newSession = [session[0], session[1], team];
                    saveStorage('session', newSession);

                    const trainerIndex = trainers.findIndex(e => e.name === session[1]);

                    if (trainerIndex !== -1) {
                        trainers[trainerIndex].team = team;
                    }

                    saveStorage('trainers', trainers);
                } else {
                    alert('Your team is full!')
                }
            });



            // Clear text field
            pokemonInput.value = '';
        }
        catch (error) { 
            alert('Pokemon cannot be found (other forms) or network issues. Please check your console for a detailed view.');
            console.error(error);
            pokemonInput.value = '';
        }
    }

    fetchPokemon();
})

pokemonInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        pokemonBtn.click();
    }
});

logoutBtn.addEventListener('click', () => {
    let session = loadStorage('session');
    session = null;
    saveStorage('session', session);
    location.reload();
});

function capitalizeFirstLetter(word) {
    if (word.length === 0) {
        return "";
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
}

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    pokemonInput.value = 'charizard';
    pokemonBtn.click();
});