import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
import Likes from './models/Likes';


/* Global state of the app 
 - Search obect
 - Current receope object 
 -Shopping list object
 - Liked recipes
*/
const state = {

};
window.state = state;
// Search Controller
const controlSearch = async () => {
    //1. Get the Query from the the view
    const query = searchView.getInput();
    
    if (query) {
        // 2. New search obj and add to thate
        state.search = new Search(query);

        // 3.prepare Ui for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            //4. Search for recipes
            await state.search.getResults();
            
            // 5. Render results to ui
            clearLoader();
            searchView.renderResult(state.search.result);
        } catch (err) {
            alert("Error searching for recipe");
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-inline');
    
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResult(state.search.result, goToPage);
    }
})

// Recipe Controller
const controlRecipe = async () => {
    // Get the Id from the url 
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected seach item

        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get the Recipe Data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render the recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (err) {
            alert('Error processing recipe')
        }
        
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// List Controller 

const controlList = () => {
    // Create a new list if there's none yet
    if (!state.list) { state.list = new List() };
    // Add each ingredients to the list
    
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};
// handle delete and update list items event

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // delete from state
        state.list.deleteItem(id);

        // delete from the ui 
        listView.deleteItem(id);

        // handle the 
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        if (val > 0) state.list.updateCount(id, val);
    }
});

// Like Controller
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // user has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        // toggle the like button
        likesView.toggleLikeBtn(true);

        // add like to ui list
        likesView.renderLike(newLike);
    // user hasliked the current recipe
    } else {
        // remove like from the state
        state.likes.deleteLike(currentID);
        // toggle the like button
        likesView.toggleLikeBtn(false);
        // remove like to ui list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// Handling recipe button cliks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decreased button was clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button was clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});