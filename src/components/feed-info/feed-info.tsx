import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  getOrders,
  getTotal,
  getTotalToDay
} from '../../services/slices/feedSlice';

const getOrdersStatus = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector(getOrders);
  const feed = {
    total: useSelector(getTotal),
    totalToday: useSelector(getTotalToDay)
  };

  const readyOrders = getOrdersStatus(orders, 'done');

  const pendingOrders = getOrdersStatus(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
