import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Likes';
import * as searchView from './view/searchView';
import * as recipeView from './view/recipeView';
import * as listView from './view/listView';
import * as likesView from './view/likesView';
import {elements,renderLoader,clearLoader} from './view/base';


/*Global state
*- Search object
*- shopping list
*-Current recipe object
*- liked recipes
*/
const state = {};

const controlSearch = async () => {

    // Get query from view
    const query = searchView.getInput();


    if(query){
        //New search object add to state
        state.search = new Search(query);
        
        //Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.results);

        //Search for recipes
       await state.search.getResults();

        //Renders result on UI
        clearLoader();
        searchView.renderResults(state.search.result);        
    }
}


elements.searchForm.addEventListener('submit',e =>{
    e.preventDefault();
    controlSearch();
});


elements.resultPages.addEventListener('click',e =>{

    const btn = e.target.closest('.btn-inline')

    if(btn){
        const goToPage = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);  
    }

});

//Recipe controller

const controlRecipe = async () => {
        //Get id from url
    const id = window.location.hash.replace('#','');

    if(id){

        //Prepare UI for changes
            recipeView.clearRecipe();
            renderLoader(elements.recipe);

            //Highlight selected search item
            if(state.search) searchView.highlightSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id);
        

        //Get recipe data and parse ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        //Calc serving anf time
        state.recipe.calcTime();
        state.recipe.calcServings();

        //Render recipe
        clearLoader();
        recipeView.clearRecipe();
        recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
  
    }

}


['hashchange','load'].forEach(event=> window.addEventListener(event,controlRecipe));



/*
LIST CONTROLLER
*/
const controlList = () => {

    //Create a new list if there in none yet
    if(!state.list) state.list = new List();

    //Add ingredient to the list
    state.recipe.ingredients.forEach(el =>{

       const item = state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
    });


};

//Handle delete and update list item events
elements.shopping.addEventListener('click',e =>{

    

    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle delete event
    if(e.target.matches('.shopping__delete, .shopping__delete *')){

        //Delete from  state
        state.list.deleteItem(id);
        
        //Delete from UI
        
        listView.deleteItem(id);

        //handle count update
    }else if(e.target.matches('.shopping__count-value')){

            const val = parseFloat(e.target.value);
            state.list.updateCount(id,val);

            

    }
});

/*
LIKES CONTROLLER
*/
state.likes = new Like();
likesView.toggleLikeMenu(state.likes.getNumLikes());
const controlLike = () => {

    if(!state.likes) state.likes = new Like();

    const currentID = state.recipe.id;

    //user has not liked current recipe
    if(!state.likes.isLiked(currentID)){

        //Add like to data
        const newLike = state.likes.addLike(

            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image

        );

        //Toggle like button
            likesView.toggleLikeBtn(true);

        //Add like to UI list
            likesView.renderLike(newLike);

    }else{

         //Remove like to data
            state.likes.deleteItem(currentID);

        //Toggle like button
        likesView.toggleLikeBtn(false);

        //Remove like to UI list
        likesView.deleteLike(currentID);
    };

    likesView.toggleLikeMenu(state.likes.getNumLikes());

};
 


//Handling recipe btn clicks

elements.recipe.addEventListener('click',e =>{


    if(e.target.matches('.btn-decrease, .btn-decrease *')){

        if(state.recipe.servings){
        
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if(e.target.matches('.btn-increase , .btn-increase *')){

        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn--add,.recipe__btn--add *')){

        listView.emptyShopping();
        controlList();

    }else if(e.target.matches('.recipe__love, .recipe__love *')){

        controlLike();

    }

    console.log(state);
    e.preventDefault();
});
