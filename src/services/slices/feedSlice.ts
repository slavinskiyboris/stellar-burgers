import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

const ORDERS_SLICE_NAME = 'orders';

interface IFeedState {
  orders: TOrder[];
  userOrders: TOrder[];
  orderRequestData: TOrder | null;
  orderInfo: TOrder | null;
  total: number | null;
  totalToday: number | null;
  isLoading: boolean;
  error: string | null;
  orderRequest: boolean;
}

const initialState: IFeedState = {
  orders: [],
  userOrders: [],
  total: null,
  totalToday: null,
  isLoading: false,
  error: null,
  orderRequest: false,
  orderRequestData: null,
  orderInfo: null
};

export const fetchPublicOrders = createAsyncThunk(
  `${ORDERS_SLICE_NAME}/fetchPublicOrders`,
  async () => getFeedsApi()
);

export const fetchUserOrders = createAsyncThunk(
  `${ORDERS_SLICE_NAME}/fetchUserOrders`,
  async () => getOrdersApi()
);

export const createOrder = createAsyncThunk(
  `${ORDERS_SLICE_NAME}/createOrder`,
  async (data: string[]) => {
    const order = await orderBurgerApi(data);
    return order;
  }
);

export const fetchOrderDetails = createAsyncThunk(
  `${ORDERS_SLICE_NAME}/fetchOrderDetails`,
  async (id: number) => getOrderByNumberApi(id)
);

const ordersSlice = createSlice({
  name: `${ORDERS_SLICE_NAME}`,
  initialState,
  reducers: {
    resetOrderData: (state) => {
      state.orderRequestData = null;
      state.orderRequest = false;
    }
  },
  selectors: {
    getAllOrders: (state) => state.orders,
    getTotalCount: (state) => state.total,
    getTodayCount: (state) => state.totalToday,
    getPersonalOrders: (state) => state.userOrders,
    getOrderDetails: (state) => state.orderInfo,
    getOrderData: (state) => state.orderRequestData,
    getOrderStatus: (state) => state.orderRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchPublicOrders.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Не удалось получить заказы';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Не удалось получить заказы';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderRequestData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
        state.error = 'Не удалось oтправить заказ';
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderInfo = action.payload.orders[0];
      })
      .addCase(fetchOrderDetails.rejected, (state) => {
        state.orderRequest = false;
        state.error = 'Не удалось oтправить заказ';
      });
  }
});

export const orderReducer = ordersSlice.reducer;
export const {
  getAllOrders,
  getTotalCount,
  getTodayCount,
  getPersonalOrders,
  getOrderData,
  getOrderStatus,
  getOrderDetails
} = ordersSlice.selectors;
export const { resetOrderData } = ordersSlice.actions;
