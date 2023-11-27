const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// event listeners
searchBtn.addEventListener('click', getMealList);
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getMealList();
    }
});
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// mendapatkan daftar makanan yang sesuai dengan bahan-bahannya
async function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`);
        const data = await response.json();

        let html = "";
        if (data.meals) {
            data.meals.forEach(meal => {
                html += `
                    <div class="meal-item" data-id="${meal.idMeal}">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="food">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href="#" class="recipe-btn">Lihat Resep</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else {
            html = "Maaf, makanan tidak ditemukan";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    } catch (error) {
        console.error("Error :", error);
    }
}

// mendapatkan resep makanannya
async function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`);
            const data = await response.json();
            mealRecipeModal(data.meals);
        } catch (error) {
            console.error("Error fetching meal recipe:", error);
        }
    }
}

// modal
function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Langkah-langkah:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Lihat Video Resep</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// menampilkan satu makanan acak
document.addEventListener("DOMContentLoaded", () => {
    const getMakananAcak = async () => {
        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
            const data = await response.json();
            const makananAcak = data.meals[0];

            const container = document.getElementById("makananAcakContainer");
            container.innerHTML = `
                <h3>${makananAcak.strMeal}</h3>
                <img src="${makananAcak.strMealThumb}" alt="${makananAcak.strMeal}">
                <p>${makananAcak.strInstructions}</p>
                <a href="${makananAcak.strYoutube}" class = "hyperlink-text" target="_blank">Lihat Video Resep</a>
            `;
        } catch (error) {
            console.error("Error fetching random meal:", error);
        }
    };

    document.querySelector(".btnMakananAcak").addEventListener("click", getMakananAcak);
});

