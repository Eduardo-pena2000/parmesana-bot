const { Pool } = require('pg');

class OrderManager {
  constructor() {
    // Si tienes PostgreSQL configurado, descomentar:
    // this.pool = new Pool({
    //   connectionString: process.env.DATABASE_URL
    // });
    
    // Por ahora usaremos almacenamiento en memoria para el prototipo
    this.orders = new Map();
    this.orderCounter = 1000;
  }

  // Crear nuevo pedido
  async createOrder(phoneNumber, orderData) {
    const orderId = `ORD-${this.orderCounter++}`;
    
    const order = {
      id: orderId,
      phoneNumber,
      items: orderData.items || [],
      total: orderData.total || 0,
      deliveryAddress: orderData.delivery_address || null,
      customerName: orderData.customer_name || null,
      status: 'pending', // pending, confirmed, preparing, delivering, completed, cancelled
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: orderData.notes || ''
    };

    this.orders.set(orderId, order);
    
    console.log(`📝 Nuevo pedido creado: ${orderId}`);
    
    return order;
  }

  // Obtener pedido por ID
  async getOrder(orderId) {
    return this.orders.get(orderId) || null;
  }

  // Obtener pedidos de un cliente
  async getOrdersByPhone(phoneNumber) {
    const customerOrders = [];
    
    for (const [id, order] of this.orders.entries()) {
      if (order.phoneNumber === phoneNumber) {
        customerOrders.push(order);
      }
    }
    
    return customerOrders.sort((a, b) => b.createdAt - a.createdAt);
  }

  // Confirmar pedido
  async confirmOrder(orderId) {
    const order = this.orders.get(orderId);
    
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    order.status = 'confirmed';
    order.updatedAt = new Date();
    
    this.orders.set(orderId, order);
    
    console.log(`✅ Pedido confirmado: ${orderId}`);
    
    return order;
  }

  // Actualizar estado del pedido
  async updateOrderStatus(orderId, newStatus) {
    const order = this.orders.get(orderId);
    
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Estado inválido');
    }

    order.status = newStatus;
    order.updatedAt = new Date();
    
    this.orders.set(orderId, order);
    
    console.log(`🔄 Pedido ${orderId} actualizado a: ${newStatus}`);
    
    return order;
  }

  // Cancelar pedido
  async cancelOrder(orderId) {
    return await this.updateOrderStatus(orderId, 'cancelled');
  }

  // Completar pedido
  async completeOrder(orderId) {
    return await this.updateOrderStatus(orderId, 'completed');
  }

  // Obtener estadísticas
  async getStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let total = 0;
    let todayCount = 0;
    let pending = 0;
    let completed = 0;
    let totalRevenue = 0;
    let todayRevenue = 0;

    for (const [id, order] of this.orders.entries()) {
      total++;
      totalRevenue += order.total;

      if (order.createdAt >= today) {
        todayCount++;
        todayRevenue += order.total;
      }

      if (order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing') {
        pending++;
      }

      if (order.status === 'completed') {
        completed++;
      }
    }

    return {
      total,
      today: todayCount,
      pending,
      completed,
      totalRevenue,
      todayRevenue
    };
  }

  // Obtener pedidos pendientes
  async getPendingOrders() {
    const pending = [];
    
    for (const [id, order] of this.orders.entries()) {
      if (order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing') {
        pending.push(order);
      }
    }
    
    return pending.sort((a, b) => a.createdAt - b.createdAt);
  }

  // Obtener todos los pedidos
  async getAllOrders(limit = 50) {
    const allOrders = Array.from(this.orders.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
    
    return allOrders;
  }

  // Agregar item al pedido
  async addItemToOrder(orderId, item) {
    const order = this.orders.get(orderId);
    
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    order.items.push(item);
    order.total += item.price * (item.quantity || 1);
    order.updatedAt = new Date();
    
    this.orders.set(orderId, order);
    
    return order;
  }

  // Remover item del pedido
  async removeItemFromOrder(orderId, itemIndex) {
    const order = this.orders.get(orderId);
    
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    if (itemIndex < 0 || itemIndex >= order.items.length) {
      throw new Error('Item no encontrado');
    }

    const removedItem = order.items.splice(itemIndex, 1)[0];
    order.total -= removedItem.price * (removedItem.quantity || 1);
    order.updatedAt = new Date();
    
    this.orders.set(orderId, order);
    
    return order;
  }
}

module.exports = OrderManager;
