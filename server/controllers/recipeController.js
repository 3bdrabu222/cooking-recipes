require('../models/database');
const mealDBService = require('../services/mealDBService');

/**
 * GET /
 * Homepage - Using TheMealDB API
*/
exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5;
    
    // Get categories from API
    const apiCategories = await mealDBService.getAllCategories();
    const categories = apiCategories.slice(0, limitNumber).map(cat => ({
      name: cat.strCategory,
      image: cat.strCategoryThumb
    }));

    // Get random recipes for different sections
    const latest = [];
    const thai = [];
    const american = [];
    const chinese = [];

    // Get random recipes
    for (let i = 0; i < limitNumber; i++) {
      const randomRecipe = await mealDBService.getRandomRecipe();
      if (randomRecipe) {
        const recipe = mealDBService.convertMealDBToRecipe(randomRecipe);
        latest.push(recipe);
      }
    }

    // Get Thai recipes
    const thaiRecipes = await mealDBService.getRecipesByCategory('Thai');
    thaiRecipes.slice(0, limitNumber).forEach(meal => {
      thai.push({
        id: meal.idMeal,
        name: meal.strMeal,
        image: meal.strMealThumb,
        mealDBId: meal.idMeal
      });
    });

    // Get American recipes
    const americanRecipes = await mealDBService.getRecipesByCategory('American');
    americanRecipes.slice(0, limitNumber).forEach(meal => {
      american.push({
        id: meal.idMeal,
        name: meal.strMeal,
        image: meal.strMealThumb,
        mealDBId: meal.idMeal
      });
    });

    // Get Chinese recipes
    const chineseRecipes = await mealDBService.getRecipesByCategory('Chinese');
    chineseRecipes.slice(0, limitNumber).forEach(meal => {
      chinese.push({
        id: meal.idMeal,
        name: meal.strMeal,
        image: meal.strMealThumb,
        mealDBId: meal.idMeal
      });
    });

    const food = { latest, thai, american, chinese };

    res.render('index', { title: 'Cooking Blog - Home', categories, food, fromAPI: true } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories - Using TheMealDB API
*/
exports.exploreCategories = async(req, res) => {
  try {
    const apiCategories = await mealDBService.getAllCategories();
    const categories = apiCategories.map(cat => ({
      name: cat.strCategory,
      image: cat.strCategoryThumb,
      description: cat.strCategoryDescription
    }));
    res.render('categories', { title: 'Cooking Blog - Categories', categories, fromAPI: true } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /categories/:id
 * Categories By Id - Using TheMealDB API
*/
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const mealDBRecipes = await mealDBService.getRecipesByCategory(categoryId);
    const categoryById = mealDBRecipes.map(meal => ({
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      mealDBId: meal.idMeal
    }));
    res.render('categories', { title: `Cooking Blog - ${categoryId} Recipes`, categoryById, categoryName: categoryId, fromAPI: true } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /recipe/:id
 * Recipe - Using TheMealDB API
*/
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    // Try to get from API first
    const mealDBRecipe = await mealDBService.getRecipeById(recipeId);
    if (mealDBRecipe) {
      const recipe = mealDBService.convertMealDBToRecipe(mealDBRecipe);
      return res.render('recipe', { title: `Cooking Blog - ${recipe.name}`, recipe, fromAPI: true } );
    }
    res.status(404).send({message: 'Recipe not found' });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * POST /search
 * Search - Using TheMealDB API
*/
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const mealDBRecipes = await mealDBService.searchRecipesByName(searchTerm);
    const recipes = mealDBRecipes.map(meal => mealDBService.convertMealDBToRecipe(meal));
    res.render('search', { title: 'Cooking Blog - Search', recipe: recipes, searchTerm, fromAPI: true } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
  
}

/**
 * GET /explore-latest
 * Explore Latest - Using TheMealDB API (Random recipes)
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipes = [];
    
    // Get random recipes
    for (let i = 0; i < limitNumber; i++) {
      const randomRecipe = await mealDBService.getRandomRecipe();
      if (randomRecipe) {
        const recipe = mealDBService.convertMealDBToRecipe(randomRecipe);
        recipes.push(recipe);
      }
    }
    
    res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe: recipes, fromAPI: true } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 



/**
 * GET /explore-random
 * Explore Random - Using TheMealDB API
*/
exports.exploreRandom = async(req, res) => {
  try {
    const mealDBRecipe = await mealDBService.getRandomRecipe();
    if (!mealDBRecipe) {
      return res.status(404).send({message: 'No recipe found'});
    }
    const recipe = mealDBService.convertMealDBToRecipe(mealDBRecipe);
    res.render('explore-random', { title: `Cooking Blog - ${recipe.name}`, recipe, fromAPI: true } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /submit-recipe
 * Submit Recipe - Disabled, using API only
*/
exports.submitRecipe = async(req, res) => {
  res.render('submit-recipe', { 
    title: 'Cooking Blog - Submit Recipe', 
    apiOnly: true 
  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe - Disabled, using API only
*/
exports.submitRecipeOnPost = async(req, res) => {
  req.flash('infoErrors', 'Recipe submission is disabled. This site uses TheMealDB API only.');
  res.redirect('/submit-recipe');
}




// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();


/**
 * Dummy Data Example 
*/

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();


// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();


/**
 * GET /about
 * About Page 
*/
exports.about = async(req, res) => {
  try {
    res.render('about', { title: 'Cooking Blog - About Us' });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred" });
  }
}

/**
 * GET /contact
 * Contact Page 
*/
exports.contact = async(req, res) => {
  try {
    res.render('contact', { title: 'Cooking Blog - Contact Us' });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred" });
  }
}

/**
 * POST /contact
 * Handle Contact Form
*/
exports.contactPost = async(req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    // Here you would typically handle the form submission
    // For now, we'll just redirect back with a success message
    req.flash('success', 'Thank you for your message. We will get back to you soon!');
    res.redirect('/contact');
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred" });
  }
}

/**
 * TheMealDB API Controllers
 * Note: mealDBService is already imported at the top
 */

/**
 * GET /api-recipes
 * Browse recipes from TheMealDB API
 */
exports.browseAPIRecipes = async(req, res) => {
  try {
    const categories = await mealDBService.getAllCategories();
    const areas = await mealDBService.getAllAreas();
    res.render('api-recipes', { 
      title: 'Cooking Blog - Browse API Recipes', 
      categories, 
      areas 
    });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred" });
  }
}

/**
 * GET /api-recipes/random
 * Get random recipe from TheMealDB API
 */
exports.getRandomAPIRecipe = async(req, res) => {
  try {
    const mealDBRecipe = await mealDBService.getRandomRecipe();
    if (!mealDBRecipe) {
      return res.status(404).send({message: 'No recipe found'});
    }
    const recipe = mealDBService.convertMealDBToRecipe(mealDBRecipe);
    res.render('api-recipe-detail', { 
      title: `Cooking Blog - ${recipe.name}`, 
      recipe,
      fromAPI: true
    });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred" });
  }
}

/**
 * GET /api-recipes/search
 * Search recipes from TheMealDB API
 */
exports.searchAPIRecipes = async(req, res) => {
  try {
    const searchTerm = req.query.q || '';
    let recipes = [];
    
    if (searchTerm) {
      const mealDBRecipes = await mealDBService.searchRecipesByName(searchTerm);
      recipes = mealDBRecipes.map(meal => mealDBService.convertMealDBToRecipe(meal));
    }
    
    res.render('api-recipes-search', { 
      title: 'Cooking Blog - Search API Recipes', 
      recipes,
      searchTerm
    });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred" });
  }
}

/**
 * GET /api-recipes/category/:category
 * Get recipes by category from TheMealDB API
 */
exports.getAPIRecipesByCategory = async(req, res) => {
  try {
    const category = req.params.category;
    const mealDBRecipes = await mealDBService.getRecipesByCategory(category);
    const recipes = mealDBRecipes.map(meal => {
      // For filtered results, we only have basic info, need to fetch full details
      return {
        id: meal.idMeal,
        name: meal.strMeal,
        image: meal.strMealThumb
      };
    });
    
    res.render('api-recipes-category', { 
      title: `Cooking Blog - ${category} Recipes`, 
      recipes,
      category
    });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred" });
  }
}

/**
 * GET /api-recipes/area/:area
 * Get recipes by area from TheMealDB API
 */
exports.getAPIRecipesByArea = async(req, res) => {
  try {
    const area = req.params.area;
    const mealDBRecipes = await mealDBService.getRecipesByArea(area);
    const recipes = mealDBRecipes.map(meal => {
      return {
        id: meal.idMeal,
        name: meal.strMeal,
        image: meal.strMealThumb
      };
    });
    
    res.render('api-recipes-area', { 
      title: `Cooking Blog - ${area} Recipes`, 
      recipes,
      area
    });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred" });
  }
}

/**
 * GET /api-recipes/detail/:id
 * Get recipe details by ID from TheMealDB API
 */
exports.getAPIRecipeDetail = async(req, res) => {
  try {
    const recipeId = req.params.id;
    const mealDBRecipe = await mealDBService.getRecipeById(recipeId);
    
    if (!mealDBRecipe) {
      return res.status(404).send({message: 'Recipe not found'});
    }
    
    const recipe = mealDBService.convertMealDBToRecipe(mealDBRecipe);
    res.render('api-recipe-detail', { 
      title: `Cooking Blog - ${recipe.name}`, 
      recipe,
      fromAPI: true
    });
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occurred" });
  }
}

/**
 * POST /api-recipes/import/:id
 * Import recipe from TheMealDB API to local database
 */
exports.importAPIRecipe = async(req, res) => {
  try {
    const recipeId = req.params.id;
    const mealDBRecipe = await mealDBService.getRecipeById(recipeId);
    
    if (!mealDBRecipe) {
      req.flash('infoErrors', 'Recipe not found in API');
      return res.redirect('/api-recipes');
    }
    
    const recipeData = mealDBService.convertMealDBToRecipe(mealDBRecipe);
    
    // Check if recipe already exists
    const existingRecipe = await Recipe.findOne({ 
      $or: [
        { name: recipeData.name },
        { mealDBId: recipeData.mealDBId }
      ]
    });
    
    if (existingRecipe) {
      req.flash('infoErrors', 'Recipe already exists in database');
      return res.redirect(`/api-recipes/detail/${recipeId}`);
    }
    
    // Create new recipe
    const newRecipe = new Recipe({
      name: recipeData.name,
      description: recipeData.description.substring(0, 500), // Limit description length
      email: recipeData.email,
      ingredients: recipeData.ingredients,
      category: recipeData.category,
      image: recipeData.image,
      mealDBId: recipeData.mealDBId,
      area: recipeData.area,
      tags: recipeData.tags,
      youtube: recipeData.youtube,
      source: recipeData.source
    });
    
    await newRecipe.save();
    req.flash('infoSubmit', 'Recipe imported successfully!');
    res.redirect(`/recipe/${newRecipe._id}`);
  } catch (error) {
    req.flash('infoErrors', error.message || 'Error importing recipe');
    res.redirect('/api-recipes');
  }
}