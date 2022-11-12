let fav = new Set();
let favPage = false;
if(localStorage.getItem("favList") === null){
    localStorage.setItem("favList", JSON.stringify(Array.from(fav)));
}else{
    fav = new Set(JSON.parse(localStorage.getItem("favList")));
    console.log(fav);
    console.log("a");
    console.log(fav.has(parseInt("52952")));
    console.log(fav)
}
let inputField = document.getElementById('input-field');
let moreDetailsButton = document.querySelector(".more-details-button");
let bodyHolder = document.querySelector(".meal-holder-flex-container");
let searchBarSubmit = document.querySelector(".search-bar-submit");
let viewFavouriteButton = document.querySelector(".view-favourite-button");
let resultName = document.querySelector("#result-name");
// let mealDetailContainer = document.querySelector(".meal-detail-container");

viewFavouriteButton.addEventListener('click', async function favIterator(event){
    console.log("reached");
    let html = "";
    bodyHolder.innerHTML = html;
    favPage = true;
    if(fav == null || fav.size==0){
        resultName.innerHTML = "<h3>No items in Favourite List</h3>"
    }
    for (const ele of fav){
        html = await fetchMealWithName("https://www.themealdb.com/api/json/v1/1/lookup.php?i=",ele, html);
        console.log(html);
    }
    event.stopPropagation();
});

searchBarSubmit.addEventListener('submit', (event) =>{
    event.preventDefault();
    favPage = false;
    let val = event.target.value;
    if(val == null){
        // bodyHolder.innerHTML = "";
        // console.log('reached')
        return;
    }
    console.log('val', val);
    // if(val.length == 1){
    //     fetchMealWithName("https://www.themealdb.com/api/json/v1/1/search.php?f=", val, "")
    // }
    if(val.length >= 1){
        fetchMealWithName("https://www.themealdb.com/api/json/v1/1/search.php?s=", val, "");
    }
    event.target.value = "";
})

inputField.addEventListener('input', function demo(event){
    event.preventDefault();
    favPage = false
    let val = event.target.value;
    console.log('val', val);
    if(val == null){
        // bodyHolder.innerHTML = "";
        return;
    }
    // if(val.length == 1){
    //     fetchMealWithName("https://www.themealdb.com/api/json/v1/1/search.php?f=", val, "");
    //     localStorage.setItem('recentSearch', val);
    // }
    if(val.length >= 1){
        fetchMealWithName("https://www.themealdb.com/api/json/v1/1/search.php?s=", val, "");
        localStorage.setItem('recentSearch', val);
    }
});

console.log(localStorage.getItem("recentSearch"));
if(localStorage.getItem("recentSearch") != null && localStorage.getItem("recentSearch").length>0){
    let val = localStorage.getItem("recentSearch");
    if(val.length == 1){
        fetchMealWithName("https://www.themealdb.com/api/json/v1/1/search.php?f=", val, "");
        localStorage.setItem('recentSearch', val);
        inputField.setAttribute("value", val);
    }
    if(val.length > 1){
        fetchMealWithName("https://www.themealdb.com/api/json/v1/1/search.php?s=", val, "");
        localStorage.setItem('recentSearch', val);
        inputField.setAttribute("value", val);
    }
}


async function fetchMealWithId(){
    var data = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772");
    var res = await data.json();
    // console.log(res);
    console.log(res.meals);
    console.log(res.meals.length);
}

function favs(idMeal){
    var currele = document.getElementById(idMeal);
    if(fav.has(parseInt(idMeal))){
        fav.delete(parseInt(idMeal));
        localStorage.setItem("favList", JSON.stringify(Array.from(fav)));
        currele.setAttribute("style", "color:rgb(163,173,186); font-size: 25px;");
        // notify({
        //     message: 'Notification Message Here',
        //     color: 'danger',
        //     timeout: 5000
        //   });
        if(favPage){
            var foodCard = document.getElementsByClassName(idMeal);
            console.log('foodCard', foodCard[0]);
            // $("."+idMeal).fadeOut("slow");
            // var deletableItem = document.getElementsByClassName(idMeal);
            // console.log('deletableItem',deletableItem[0]);
            // deletableItem[0].addEventListener('transitionend', () => target.remove());
            // deletableItem[0].style.opacity = 0;
            foodCard[0].style.display = "none";
            // console.log('a',fav);
            // console.log(fav.size);
            if(fav==null || fav.size == 0 ){
                resultName.innerHTML = "<h3>No items in Favourite List</h3>"
            }
        }
    }else if(!fav.has(parseInt(idMeal))){
        fav.add(idMeal);
        localStorage.setItem("favList", JSON.stringify(Array.from(fav)));
        currele.setAttribute("style", "color:red; font-size: 25px;");
    }
 }


async function fetchMealWithName(url,val, html){
    var data = await fetch(url+val);
    var res = await data.json();
    // console.log(res);
    if(res.meals == null){
        if(favPage){
            resultName.innerHTML = "<h3>No items in Favourite List</h3>"
        }else if(!favPage){
            resultName.innerHTML = "<h3>No Records Found</h3>"
        } 
        bodyHolder.innerHTML = "";
        return;
    }
    // console.log(res.meals);
    // console.log(res.meals.length);
    let arr = res.meals;
    if(res.meals.length < 1){
        return;
    }
    // console.log(res.meals[0].idMeal);
    // let html = "";
    arr.forEach((element) => {
        // console.log(fav.has(parseInt(element.idMeal)));
        // console.log(typeof(element.idMeal));
        html += `<div class="meal-holder-container ${element.idMeal}">
                    <div class="img-container">
                    <img src="${element.strMealThumb}" alt="">
                </div>
                <p class="food-title">${element.strMeal}</p>
                <div class="tags-container">
                   <span>${element.strCategory}</span>
                   <span>${element.strArea}</span>
                </div>
                <div class="details-favourite-button-container">
                <button class="more-details-button btn btn-primary" onClick='moreDetails("${element.idMeal}")'>more details</button>

                ${fav.has(parseInt(element.idMeal))?`<i id="${element.idMeal}" class="fa-solid fa-heart abc" style="color: red; font-size: 25px;" onClick="favs(${element.idMeal})"></i>`:`<i id="${element.idMeal}" class="fa-solid fa-heart abc" style="color: rgb(163,173,186); font-size: 25px;"  onClick="favs(${element.idMeal})"></i>`}
                </div>
                </div>`;
            });
     
    if(favPage){
        resultName.innerHTML = "<h3>My Favourite List</h3>"
    }else if(!favPage){
        resultName.innerHTML = "<h3>Search Results</h3>"
    }        

    bodyHolder.innerHTML =  html;
    console.log(html);
    return html;
}

async function fetchMealWithStartingLetter(val){
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=' +  val)
.then(res=>res.json())
.then(data=> {
    console.log(data);
    console.log(data.meals);
    console.log(data.meals.length);
    let arr = data.meals;
    arr.forEach(element => {
        console.log(element);
        ''
    });
})
}

// function cardMoreDetails(element){
//     console.log('clicked');
//     moreDetails(element);
// }

async function moreDetails(element){
    console.log("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+element);
    var data = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+element);
    var res = await data.json();
    element = res.meals;
    element= element[0];
    console.log(element.strMealThumb);
    // window.location.href = "moreDetails.html";
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
            <td>${element.strCategory}</td>
        </tr>
        <tr>
            <th>Area</th>
            <td>:</td>
            <td>${element.strArea}</td>
        </tr>
        <tr style="vertical-align: top;">
            <th>Instructions</th>
            <td>:</td>
            <!-- replace(/[\n\r\t\s]+/g, ' ') -->
            <td>${element.strInstructions}</td>
        </tr>
    </table>
    <button type="button" class="btn btn-primary">Watch Video
        <a href="${element.strYoutube}"></a>
    </button>
</div>
    `;
    bodyHolder.innerHTML = html;
}

// function showFlashMessage(element) {
//     var event = new CustomEvent('showFlashMessage');
//     element.dispatchEvent(event);
//   };
  
//   var flashMessages = document.getElementsByClassName("meal-app-name");
//   //show first flash message avilable in your page
//   showFlashMessage(flashMessages[0]);



// fetchMealWithId();

// fetchMealWithStartingLetter();


