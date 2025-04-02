import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredienstsReducer } from './slices/ingredientSlice';
import { userReducer } from './slices/authSlice';
import { orderReducer } from './slices/feedSlice';
import { constructorReducer } from './slices/constructorSlice';

const rootReducer = combineReducers({
  ingredients: ingredienstsReducer,
  userAuth: userReducer,
  orders: orderReducer,
  burgerConstructor: constructorReducer
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
