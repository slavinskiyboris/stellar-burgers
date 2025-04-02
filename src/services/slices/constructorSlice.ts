import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const CONSTRUCTOR_SLICE_NAME = 'burgerConstructor';

interface IConstructor {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
}

const initialState: IConstructor = {
  ingredients: [],
  bun: null
};

const constructorSlice = createSlice({
  name: `${CONSTRUCTOR_SLICE_NAME}`,
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    clearIngredient: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; move: number }>
    ) => {
      const index = action.payload.index;
      const move = action.payload.move;
      [state.ingredients[index], state.ingredients[index - move]] = [
        state.ingredients[index - move],
        state.ingredients[index]
      ];
    },
    deleteIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload.id
      );
    }
  },
  selectors: { getConstructor: (state) => state }
});

export const constructorReducer = constructorSlice.reducer;
export const {
  addIngredient,
  clearIngredient,
  deleteIngredient,
  moveIngredient
} = constructorSlice.actions;
export const { getConstructor } = constructorSlice.selectors;
