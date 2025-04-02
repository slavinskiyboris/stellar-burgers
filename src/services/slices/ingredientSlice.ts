import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const INGREDIENT_SLICES_NAME = 'ingredients';

interface IIngredients {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IIngredients = {
  ingredients: [],
  isLoading: true,
  error: null
};

export const fetchIngredient = createAsyncThunk(
  `${INGREDIENT_SLICES_NAME}/fetchIngredient`,
  async () => getIngredientsApi()
);

const ingredienstSlice = createSlice({
  name: `${INGREDIENT_SLICES_NAME}`,
  initialState,
  reducers: {},
  selectors: {
    getIngredienst: (state) => state.ingredients,
    getIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredient.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Не удалось получить ингредиенты';
      });
  }
});

export const ingredienstsReducer = ingredienstSlice.reducer;
export const { getIngredienst, getIsLoading } = ingredienstSlice.selectors;
