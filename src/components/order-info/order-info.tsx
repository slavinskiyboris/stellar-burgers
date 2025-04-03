import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchOrderDetails,
  getOrderDetails,
  getAllOrders,
  getPersonalOrders
} from '../../services/slices/feedSlice';
import { getIngredienst } from '../../services/slices/ingredientSlice';
import { getUserData, getAuthStatus } from '../../services/slices/authSlice';

export const OrderInfo: FC = () => {
  // В URL может быть параметр number или id в зависимости от маршрута
  const params = useParams<{ number?: string; id?: string }>();
  const orderId = params.number || params.id || '';

  const dispatch = useDispatch();
  const location = useLocation();
  const isProfileOrder = location.pathname.includes('/profile/orders');

  // Получение данных из state с защитой от undefined
  const user = useSelector(getUserData);
  const isAuthChecked = useSelector(getAuthStatus);
  const publicOrders = useSelector(getAllOrders) || [];
  const userOrders = useSelector(getPersonalOrders) || [];
  const ingredients = useSelector(getIngredienst) || [];
  const orderDetailsFromState = useSelector(getOrderDetails);

  // Безопасный поиск заказа в кэше
  const findOrder = (orders: TOrder[], id: string): TOrder | null => {
    if (!Array.isArray(orders) || !id) return null;
    return orders.find((order) => order && order.number === Number(id)) || null;
  };

  // Пытаемся найти заказ в кэше перед запросом на сервер
  const cachedOrder = isProfileOrder
    ? findOrder(userOrders, orderId)
    : findOrder(publicOrders, orderId);

  useEffect(() => {
    // Если заказа нет в кэше - запрашиваем с сервера
    if (!cachedOrder && orderId) {
      dispatch(fetchOrderDetails(Number(orderId)));
    }
  }, [cachedOrder, orderId, dispatch]);

  // Получаем данные заказа из кэша или из state
  const orderData = cachedOrder || orderDetailsFromState;

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    // Проверка на наличие всех необходимых данных
    if (!orderData) return null;
    if (!Array.isArray(ingredients) || ingredients.length === 0) return null;

    // Проверка наличия необходимых свойств в orderData
    if (!orderData.createdAt) return null;
    if (
      !Array.isArray(orderData.ingredients) ||
      orderData.ingredients.length === 0
    )
      return null;

    try {
      const date = new Date(orderData.createdAt);

      // Создаем безопасную копию массива ингредиентов, исключая undefined и null
      const safeIngredients = orderData.ingredients.filter(
        (item: string) => item
      );

      // Определяем тип для аккумулятора
      type TIngredientsWithCount = Record<
        string,
        TIngredient & { count: number }
      >;

      // Создаем карту ингредиентов с подсчетом количества
      const ingredientsInfo = safeIngredients.reduce<TIngredientsWithCount>(
        (acc, item) => {
          // Пропускаем пустые id
          if (!item) return acc;

          // Если этот ингредиент еще не в аккумуляторе
          if (!acc[item]) {
            // Ищем информацию об ингредиенте
            const ingredientDetails = ingredients.find(
              (ing) => ing && ing._id === item
            );

            // Добавляем, только если нашли информацию
            if (ingredientDetails) {
              acc[item] = {
                ...ingredientDetails,
                count: 1
              };
            }
          } else {
            // Увеличиваем счетчик существующего ингредиента
            acc[item].count++;
          }

          return acc;
        },
        {}
      );

      // Проверяем, что у нас есть данные о ингредиентах
      if (Object.keys(ingredientsInfo).length === 0) {
        return null;
      }

      // Безопасный подсчет стоимости
      const total = Object.values(ingredientsInfo).reduce(
        (acc: number, item) => {
          if (
            !item ||
            typeof item.price !== 'number' ||
            typeof item.count !== 'number'
          ) {
            return acc;
          }
          return acc + item.price * item.count;
        },
        0
      );

      // Формируем финальный объект с информацией о заказе
      return {
        ...orderData,
        ingredientsInfo,
        date,
        total
      };
    } catch (error) {
      console.error('Ошибка при обработке данных заказа:', error);
      return null;
    }
  }, [orderData, ingredients]);

  // Если заказ в приватной секции и проверка авторизации еще идет, показываем прелоадер
  if (isProfileOrder && !isAuthChecked) {
    return <Preloader />;
  }

  // Если заказ в приватной секции и пользователь не авторизован, показываем прелоадер пока идет редирект
  if (isProfileOrder && !user) {
    return <Preloader />;
  }

  // Если данные о заказе еще не готовы, показываем прелоадер
  if (!orderInfo) {
    return <Preloader />;
  }

  // Возвращаем компонент с данными заказа
  try {
    return <OrderInfoUI orderInfo={orderInfo} />;
  } catch (error) {
    console.error('Ошибка при рендеринге OrderInfoUI:', error);
    return <Preloader />;
  }
};
