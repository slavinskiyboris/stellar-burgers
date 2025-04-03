import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  fetchPublicOrders,
  getAllOrders
} from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getAllOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPublicOrders());
  }, []);

  if (!orders.length) {
    return <Preloader />;
  } else
    return (
      <FeedUI
        orders={orders}
        handleGetFeeds={() => {
          dispatch(fetchPublicOrders());
        }}
      />
    );
};
