import { useState } from "react";
import { toast } from 'react-toastify';
import { Order } from "../../types/Order";
import { api } from "../../utils/api";
import { OrderModal } from "../OrderModal";
import { Board, OrdersContainer } from "./styles";

interface OrdersBoardProps{
  icon: String,
  title: String,
  orders: Order[],
  onCancelOrder: (orderId:string) => void,
  onChangeOrderStatus: (orderId:string, status: Order['status']) => void
}
export function OrdersBoard({icon, title, orders, onCancelOrder, onChangeOrderStatus}: OrdersBoardProps){
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<null | Order>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleOpenModal(order: Order){
    setIsModalVisible(true);
    setSelectedOrder(order);
  }

  function handleCloseModal(){
    setIsModalVisible(false);
    setSelectedOrder(null);
  }

  async function handleChangeOrderStatus(){
    setIsLoading(true);

    const status = selectedOrder?.status === 'WAITING'
    ? 'IN_PRODUCTION'
    : 'DONE';

    await api.patch(`/orders/:${selectedOrder?._id}, ${ status }`);

    toast.success(`O pedido da mesa ${selectedOrder?.table} teve o status alterado`);

    setIsLoading(false);
    onChangeOrderStatus(selectedOrder!._id, status);
    setIsModalVisible(false);
  }

  async function handleCancelOrder(){
    setIsLoading(true);
    if (!selectedOrder) return;
    await api.delete(`/orders/:${selectedOrder?._id}`);

    toast.success(`O pedido da mesa ${selectedOrder?.table} foi cancelado`);
    onCancelOrder(selectedOrder!._id)
    setIsLoading(false);
    setIsModalVisible(false);
  }

  return (
    <>
    <OrderModal
      visible={isModalVisible}
      order={selectedOrder}
      onClose={handleCloseModal}
      onCancelOrder={handleCancelOrder}
      onChangeOrderStatus={handleChangeOrderStatus}
      isLoading={isLoading}
    />
    <Board>
      <header>
        <span>{icon}</span>
        <strong>{title}</strong>
        <span>(1)</span>
      </header>
      {orders.length > 0 && (
        <OrdersContainer>
          {orders.map((order) => (
            <button type="button" key={order._id} onClick={() => handleOpenModal(order)}>
            <strong>Mesa {order.table}</strong>
            <span>{order.products.length} itens</span>
          </button>
          ))
          }
        </OrdersContainer>
      )}
    </Board>
    </>
  )
}
