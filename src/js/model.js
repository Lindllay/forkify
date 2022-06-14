import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(err);
    throw err; // re-throwing an error. Czyli po prostu throwuje jeszcze raz error, który złapałem
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
    state.search.page = 1; // resetuje page przy każdym załadowaniu nowej listy
  } catch (err) {
    console.error(err);
    throw err; // re-throw
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 9 (bo slice nie wyświetla dziesiątej/ostatniej pozycji)
  return state.search.results.slice(start, end); // slice nie wyświetla ostatniej liczby, więc w rzeczywistości wyświetli pozycje 0-9.
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);

  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true; // dodaję właściwość bookmarked o wartości true do state.recipe, gdy... spełniony zostanie ten warunek. ale nie rozumiem tego warunku, już się pogubiłem czym jest recipe.id a czym state.recipe.id. W komentarzach piszą, że sprawdzanie tego warunku nie ma sensu, bo recipe.id i state.recipe.id to to samo
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id); // gdy warunek w findIndex zostanie spełniony, to do zmiennej index podany zostanie index, w którym znajduje się bookmark do usunięcia.
  state.bookmarks.splice(index, 1); // Następnie biorę ten index i usuwam z dany bookmark z arraya.

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};

// podobno to częsty pattern w programowaniu, że gdy coś dodaję, to podaję wszystkie dane (jak w addBookmark function), a jak usuwam, to tylko id
