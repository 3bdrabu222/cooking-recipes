/**
 * TheMealDB API Service
 * Free recipe API - No API key required
 * Documentation: https://www.themealdb.com/api.php
 */

const axios = require('axios');
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Get random recipe
 */
async function getRandomRecipe() {
  try {
    const response = await axios.get(`${BASE_URL}/random.php`);
    return response.data.meals ? response.data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    throw error;
  }
}

/**
 * Get recipe by ID
 */
async function getRecipeById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
    return response.data.meals ? response.data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    throw error;
  }
}

/**
 * Search recipes by name
 */
async function searchRecipesByName(searchTerm) {
  try {
    const response = await axios.get(`${BASE_URL}/search.php?s=${encodeURIComponent(searchTerm)}`);
    return response.data.meals || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
}

/**
 * Get recipes by category
 */
async function getRecipesByCategory(category) {
  try {
    const response = await axios.get(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    return response.data.meals || [];
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    throw error;
  }
}

/**
 * Get recipes by area/cuisine
 */
async function getRecipesByArea(area) {
  try {
    const response = await axios.get(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
    return response.data.meals || [];
  } catch (error) {
    console.error('Error fetching recipes by area:', error);
    throw error;
  }
}

/**
 * Get all categories
 */
async function getAllCategories() {
  try {
    const response = await axios.get(`${BASE_URL}/categories.php`);
    return response.data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Get all areas/cuisines
 */
async function getAllAreas() {
  try {
    const response = await axios.get(`${BASE_URL}/list.php?a=list`);
    return response.data.meals || [];
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
}

/**
 * Get recipes by ingredient
 */
async function getRecipesByIngredient(ingredient) {
  try {
    const response = await axios.get(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
    return response.data.meals || [];
  } catch (error) {
    console.error('Error fetching recipes by ingredient:', error);
    throw error;
  }
}

/**
 * Convert TheMealDB recipe format to our Recipe model format
 */
function convertMealDBToRecipe(mealDBRecipe) {
  if (!mealDBRecipe) return null;

  // Extract ingredients and measurements
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = mealDBRecipe[`strIngredient${i}`];
    const measure = mealDBRecipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
    }
  }

  // Map TheMealDB area to our category if possible
  const areaToCategory = {
    'American': 'American',
    'British': 'American',
    'Canadian': 'American',
    'Chinese': 'Chinese',
    'Indian': 'Indian',
    'Mexican': 'Mexican',
    'Thai': 'Thai',
    'Spanish': 'Spanish'
  };

  const category = areaToCategory[mealDBRecipe.strArea] || 'American';

  return {
    name: mealDBRecipe.strMeal,
    description: mealDBRecipe.strInstructions || '',
    email: 'api@themealdb.com',
    ingredients: ingredients,
    category: category,
    image: mealDBRecipe.strMealThumb || '',
    // Store TheMealDB ID for reference
    mealDBId: mealDBRecipe.idMeal,
    // Additional fields from API
    area: mealDBRecipe.strArea,
    tags: mealDBRecipe.strTags ? mealDBRecipe.strTags.split(',') : [],
    youtube: mealDBRecipe.strYoutube,
    source: mealDBRecipe.strSource
  };
}

module.exports = {
  getRandomRecipe,
  getRecipeById,
  searchRecipesByName,
  getRecipesByCategory,
  getRecipesByArea,
  getAllCategories,
  getAllAreas,
  getRecipesByIngredient,
  convertMealDBToRecipe
};

