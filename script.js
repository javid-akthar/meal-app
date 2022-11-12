// used set to store favourite List to avoid duplicate data and find delete will occur in O(1)
let fav = new Set();
let favPage = false;
let inputField = document.getElementById('input-field');
let moreDetailsButton = document.querySelector(".more-details-button");
let bodyHolder = document.querySelector(".meal-holder-flex-container");
let searchBarSubmit = document.querySelector(".search-bar-submit");
let viewFavouriteButton = document.querySelector(".view-favourite-button");
let resultName = document.querySelector("#result-name");
const flashContainer = document.getElementById('flashbar-container');

// once the page is loaded this will check for existence of historical favList in 
// local storage if anything found this will undate the db favPage with localStorage favPage
if (localStorage.getItem("favList") === null) {
    localStorage.setItem("favList", JSON.stringify(Array.from(fav)));
} else {
    fav = new Set(JSON.parse(localStorage.getItem("favList")));
}

// this will list down the fovourite List food items
viewFavouriteButton.addEventListener('click', async function favIterator(event) {
    let html = "";
    bodyHolder.innerHTML = html;
    favPage = true;
    if (fav == null || fav.size == 0) {
        resultName.innerHTML = "<h3>No items in Favourite List</h3>"
    }
    for (const ele of fav) {
        html = await fetchMealWithName("https://www.themealdb.com/api/json/v1/1/lookup.php?i=", ele, html);
    }
    event.stopPropagation();
});

// this will take care of input data the user enters in input field
searchBarSubmit.addEventListener('submit', (event) => {
    event.preventDefault();
    favPage = false;
    let val = event.target.value;
    if (val == null) {
        return;
    }
    if (val.length >= 1) {
        fetchMealWithName("https://www.themealdb.com/api/json/v1/1/search.php?s=", val, "");
    }
    event.target.value = "";
})

// do create dynamic suggestion if a user enters a data this will listen to the input field
//  and shows suggesstion
inputField.addEventListener('input', function demo(event) {
    event.preventDefault();
    favPage = false
    let val = event.target.value;
    console.log('val', val);
    if (val == null) {
        return;
    }
    if (val.length >= 1) {
        fetchMealWithName("https://www.themealdb.com/api/json/v1/1/search.php?s=", val, "");
        localStorage.setItem('recentSearch', val);
    }
});

// this method will search for the last time search input from local storage that we saved and 
// displays to the user once the page loads
if (localStorage.getItem("recentSearch") != null && localStorage.getItem("recentSearch").length > 0) {
    let val = localStorage.getItem("recentSearch");
    if (val.length == 1) {
        fetchMealWithName("https://www.themealdb.com/api/json/v1/1/search.php?f=", val, "");
        localStorage.setItem('recentSearch', val);
        inputField.setAttribute("value", val);
    }
    if (val.length > 1) {
        fetchMealWithName("https://www.themealdb.com/api/json/v1/1/search.php?s=", val, "");
        localStorage.setItem('recentSearch', val);
        inputField.setAttribute("value", val);
    }
}

// this method will take care of adding and removing meal item in favourite list
function favs(idMeal) {
    var currele = document.getElementById(idMeal);
    // this will remove the item from favourite list
    if (fav.has(parseInt(idMeal))) {
        fav.delete(parseInt(idMeal));
        localStorage.setItem("favList", JSON.stringify(Array.from(fav)));
        currele.setAttribute("style", "color:rgb(163,173,186); font-size: 25px;");
        if (favPage) {
            var foodCard = document.getElementsByClassName(idMeal);
            foodCard[0].style.display = "none";
            if (fav == null || fav.size == 0) {
                resultName.innerHTML = "<h3>No items in Favourite List</h3>"
            }
        }
        flashbar('info','Item removed from Favourite List', 3000);
    } 
    // this will add the item to favourite list
    else if (!fav.has(parseInt(idMeal))) { 
        fav.add(idMeal);
        localStorage.setItem("favList", JSON.stringify(Array.from(fav)));
        currele.setAttribute("style", "color:red; font-size: 25px;");
        flashbar('info', 'Item added to Favourite List', 3000);
    }
}

// this function will fetch the meal through mealDB API and add it to the list
async function fetchMealWithName(url, val, html) {
    var data = await fetch(url + val);
    var res = await data.json();
    if (res.meals == null) {
        if (favPage) {
            resultName.innerHTML = "<h3>No items in Favourite List</h3>"
        } else if (!favPage) {
            resultName.innerHTML = "<h3>No Meals Found for the given input</h3>"
        }
        bodyHolder.innerHTML = "";
        return;
    }
    let arr = res.meals;
    if (res.meals.length < 1) {
        return;
    }
    arr.forEach((element) => {
        html += `<div class="meal-holder-container ${element.idMeal}">
                    <div class="img-container">
                    <img src="${element.strMealThumb}" alt="${element.strMeal}">
                </div>
                <p class="food-title">${element.strMeal}</p>
                <div class="tags-container">
                   <span>${element.strCategory}</span>
                   <span>${element.strArea}</span>
                </div>
                <div class="details-favourite-button-container">
                <button class="more-details-button btn btn-primary" onClick='moreDetails("${element.idMeal}")'>more details</button>

                ${fav.has(parseInt(element.idMeal)) ? `<i id="${element.idMeal}" class="fa-solid fa-heart abc" style="color: red; font-size: 25px;" onClick="favs(${element.idMeal})"></i>` : `<i id="${element.idMeal}" class="fa-solid fa-heart abc" style="color: rgb(163,173,186); font-size: 25px;"  onClick="favs(${element.idMeal})"></i>`}
                </div>
                </div>`;
    });

    if (favPage) {
        resultName.innerHTML = "<h3>My Favourite List</h3>"
    } else if (!favPage) {
        resultName.innerHTML = "<h3>Search Results</h3>"
    }

    bodyHolder.innerHTML = html;
    return html;
}

// this function handles the more details page
async function moreDetails(element) {
    var data = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + element);
    var res = await data.json();
    element = res.meals;
    element = element[0];
    resultName.innerHTML = "<h3>Meal Details</h3>"
    var html = "";
    html += `
    <div class="meal-details-container" style="margin-left:20px; color:rgb(40,44,63);">
    <h1>${element.strMeal}</h1> 
    <img class="meal-img" src="${element.strMealThumb}" alt="${element.strMeal}">  
    <table>
        <tr>
            <th>Category</th>
            <td>:</td>
            <td>${element.strCategory==null?'-':element.strCategory}</td>
        </tr>
        <tr>
            <th>Area</th>
            <td>:</td>
            <td>${element.strArea==null?'-':element.strArea}</td>
        </tr>
        <tr style="vertical-align: top;">
            <th>Instructions</th>
            <td>:</td>
            <td>${element.strInstructions==null?'-':element.strInstructions}</td>
        </tr>
    </table>
    <button type="button" class="btn btn-primary">Watch Video
        <a href="${element.strYoutube==null?'-':element.strYoutube}"></a>
    </button>
    </div>
    `;
    bodyHolder.innerHTML = html;
}

// function to display flash message
function flashbar(type, message, time){
    const para = document.createElement('P');
    para.classList.add('flashbar');
    para.innerHTML = `${message} <span> &times </span>`;
    if(type ==='info'){
        para.classList.add('info');
    }
    flashContainer.appendChild(para);
    para.classList.add('fadeout');
    setTimeout(()=>{
            flashContainer.removeChild(para)
    }, time)
}