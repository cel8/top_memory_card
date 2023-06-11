import { Pokedex } from "pokeapi-js-wrapper";

const pokedex = new Pokedex();
const LIMIT = {
  MIN: 1,
  MAX: 1000
};

const getRandomIds = (quantity) => {
  const ids = [];
  do {
    const rand = Math.floor(Math.random() * LIMIT.MAX) + LIMIT.MIN;
    if (!ids.includes(rand)) {
      ids.push(rand);
      quantity--;
    }
  } while (quantity > 0);
  return ids;
}

const getPokemonCards = async (ids) => {
  return Promise.all(ids.map((id) => pokedex.getPokemonByName(id)));
}

const fetchCards = (quantity) => {
  const ids = getRandomIds(quantity);
  const pokemonCards = getPokemonCards(ids);
  return pokemonCards;
}

const getCards = async (quantity) => {
  const pokomenCards = await fetchCards(quantity);
  const cards = pokomenCards.map((card) => ({
    id: card.id,
    name: card.name,
    src: card.sprites.other['official-artwork'].front_shiny,
    visit: false
  }));
  
  return cards;
}

const shuffleCards = (cards) => {
  let currentIndex = cards.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [cards[currentIndex], cards[randomIndex]] = [
      cards[randomIndex], cards[currentIndex]];
  }

  return cards;
}

const getVisit = (cards, id) => {
  const idx = cards.findIndex((card) => card.id === id);
  if (idx === -1) return;
  return cards[idx].visit;
}

const setVisit = (cards, id) => {
  const idx = cards.findIndex((card) => card.id === id);
  if (idx === -1) return;
  cards[idx].visit = true;
}

const CardController = {
  get: getCards,
  shuffle: shuffleCards,
  setVisit,
  getVisit
};

export default CardController;
