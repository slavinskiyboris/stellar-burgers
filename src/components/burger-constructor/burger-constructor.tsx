import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  clearIngredient,
  getConstructor
} from '../../services/slices/constructorSlice';
import {
  clearOrderData,
  fetchOrderBurgerApi,
  getOrderRequest,
  getOrderRequestData
} from '../../services/slices/feedSlice';
import { getUser } from '../../services/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(getConstructor);
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const orderRequest = useSelector(getOrderRequest);

  const orderModalData = useSelector(getOrderRequestData);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }
    const items = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(fetchOrderBurgerApi(items)).then(() => {
      dispatch(clearIngredient());
    });
  };

  const closeOrderModal = () => {
    dispatch(clearOrderData());
    dispatch(clearIngredient());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
