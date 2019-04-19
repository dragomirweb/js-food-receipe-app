import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader } from './views/base';

//add random method to arrays
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

/* Global state of the app 
 - Search obect
 - Current receope object 
 -Shopping list object
 - Liked recipes
*/
const state = {

};

const controlSearch = async () => {
    //1. Get the Query from the the view
    const query = searchView.getInput();
    console.log(query)
    
    if (query) {
        //2. New search obj and add to thate
        state.search = new Search(query);

        //3.prepare Ui for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //4. Search for recipes
        await state.search.getResults();

        //5. Render results to ui
        searchView.renderResult(state.search.result);
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
const search = new Search('pizza');