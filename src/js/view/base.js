export const elements =  {

    searchInput : document.querySelector('.search__field'),
    searchForm:document.querySelector('.search'),
    searchResultList: document.querySelector('.results__list'),
    results : document.querySelector('.results'),
    resultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
};


export const elementString = {

    loader: 'loader',

};

export const renderLoader = parent =>{

        const loader = `
        
            <div class=${elementString.loader}>
            
                    <svg>
                            <use href="img/icons.svg#icon-cw">
                    </svg>
            
            </div>
        
        `;

        parent.insertAdjacentHTML('afterbegin',loader);

};

export const clearLoader = () => {

    const loader = document.querySelector(`.${elementString.loader}`);

    if(loader){

        loader.parentElement.removeChild(loader);

    }
};

