import assert from 'node:assert/strict'
import { test } from 'node:test'
import { allFoodDishes } from './rows'
import { assertRecipeBook, perKiloGrams, scaledRecipe } from './recipe'

test('every dish has a basic recipe and the kilo column sums to 1000 g', () => {
  const errors = assertRecipeBook(allFoodDishes().map((dish) => dish.id))
  assert.deepEqual(errors, [])
  for (const dish of allFoodDishes()) {
    const recipe = scaledRecipe(dish.id, 'ru')
    assert.ok(recipe)
    assert.equal(
      recipe.rows.reduce((sum, row) => sum + row.perKg, 0),
      1000,
    )
    assert.ok(recipe.steps.length >= 2)
    assert.ok(recipe.rows.length >= 2, `${dish.id} ingredient list`)
  }
  assert.deepEqual(perKiloGrams([100, 50, 50]), [500, 250, 250])
})
