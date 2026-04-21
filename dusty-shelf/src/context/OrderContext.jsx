import React, { createContext, useState, useCallback } from 'react';
import orderService from '../services/orderService';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set delivery address
  const setDeliveryInfo = useCallback((address) => {
    setDeliveryAddress(address);
  }, []);

  // Create new order
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.createOrder(orderData);

      // Handle both direct orderId and nested response
      const order = {
        orderId: response.orderId || response.id,
        ...response,
        createdAt: response.createdAt || new Date().toISOString(),
        status: response.status || 'placed',
      };

      setCurrentOrder(order);
      setOrders((prev) => [order, ...prev]);

      // Clear delivery address after order creation
      setDeliveryAddress(null);

      return order;
    } catch (err) {
      const errorMsg = err.message || 'Failed to create order';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user orders
  const fetchUserOrders = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getUserOrders(userId);
      const fetchedOrders = response.orders || response || [];
      setOrders(fetchedOrders);
      return fetchedOrders;
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single order details
  const getOrderDetails = useCallback(async (orderId) => {
    try {
      const order = await orderService.getOrderDetail(orderId);
      setCurrentOrder(order);
      return order;
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      throw err;
    }
  }, []);

  // Track order status
  const trackOrder = useCallback(async (orderId) => {
    try {
      const order = await orderService.trackOrder(orderId);
      return order;
    } catch (err) {
      console.error('Failed to track order:', err);
      throw err;
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId ? { ...order, status } : order
      )
    );
    if (currentOrder?.orderId === orderId) {
      setCurrentOrder((prev) => ({ ...prev, status }));
    }
  }, [currentOrder]);

  // Get order by ID from local state
  const getOrder = useCallback(
    (orderId) => {
      return orders.find((order) => order.orderId === orderId);
    },
    [orders]
  );

  // Clear current order
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
    setDeliveryAddress(null);
  }, []);

  // Clear all orders
  const clearAllOrders = useCallback(() => {
    setOrders([]);
    setCurrentOrder(null);
  }, []);

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        orders,
        deliveryAddress,
        loading,
        error,
        setDeliveryInfo,
        createOrder,
        fetchUserOrders,
        getOrderDetails,
        trackOrder,
        updateOrderStatus,
        getOrder,
        clearCurrentOrder,
        clearAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = React.useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};

export default OrderProvider;
