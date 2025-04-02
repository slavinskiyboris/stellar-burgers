import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchOrderDetails,
  getOrderDetails,
  getAllOrders
} from '../../services/slices/feedSlice';
import { getIngredienst } from '../../services/slices/ingredientSlice';

export const OrderInfo: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(fetchOrderDetails(Number(id)));
  }, []);
  /** TODO: взять переменные orderData и ingredients из стора */
  const orderData = useSelector(getOrderDetails);

  const ingredients: TIngredient[] = useSelector(getIngredienst);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
