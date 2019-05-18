import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';


/* Global state of the app 
 - Search obect
 - Current receope object 
 -Shopping list object
 - Liked recipes
*/
const state = {

};

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

        //4. Search for recipes
        await state.search.getResults();

        // 5. Render results to ui
        clearLoader();
        searchView.renderResult(state.search.result);
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
const r = new Recipe(35477)
r.getRecipe();