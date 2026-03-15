import * as orderModel from '../models/orderModel.js';

export async function checkout(req, res) {
  const order = req.body;
  console.log('New Order Received:', order);

  const { orderId } = await orderModel.createOrder(order);
  res.json({ success: true, message: 'Order processed successfully!', orderId });
}
