import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredienst } from '../../services/slices/ingredientSlice';

export const IngredientDetails: FC = () => {
  const location = useLocation();
  const { id } = useParams();
  /** TODO: взять переменную из стора */
  const ingredientData = useSelector(getIngredienst).find(
    (item) => item._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
