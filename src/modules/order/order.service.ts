import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Order, Payment } from './order.entity';
import { CreateOrderDto, OrderFilter } from './order.dto';
import { IAuthContext, OrderDir, OrderStatus } from 'src/types';
import { PaginationInput } from 'src/base/dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async verifyTransaction(transactionId: string, amount: number) {
    const paymentExists = await this.paymentRepository.findOne({
      where: { transactionId: transactionId.toString() },
    });
    if (paymentExists) throw new ConflictException('Duplicate payment');
    // TODO: CALL PAYMENT PROVIDER AND SAVE PAYMENT DETAILS IN DB
  }

  async fetchOrders(
    pagination: PaginationInput,
    filter: OrderFilter,
    { userId }: IAuthContext,
  ) {
    const { page = 1, limit = 20 } = pagination;
    return this.orderRepository.find({
      where: {
        ...(userId ? { customer: { id: userId } } : {}),
        ...(filter?.status ? { status: filter?.status } : {}),
        ...(filter?.startDate
          ? { createdAt: MoreThanOrEqual(filter?.startDate) }
          : {}),
        ...(filter?.endDate
          ? { createdAt: LessThanOrEqual(filter?.endDate) }
          : {}),
      },
      order: {
        [pagination.orderBy || 'createdAt']:
          pagination.orderDir || OrderDir.DESC,
      },
      skip: limit * (page - 1),
      take: limit,
    });
  }

  async createOrder(order: CreateOrderDto, { userId }: IAuthContext) {
    const payment = await this.paymentRepository.findOneBy({
      id: order.paymentId,
    });
    if (!payment)
      throw new NotFoundException('Provided payment does not exist');
    if (!payment.status.toLowerCase().includes('paid')) {
      throw new NotAcceptableException('Provided payment is not valid');
    }
    const existingOrder = await this.orderRepository.findOneBy({
      payment: { id: order.paymentId },
    });
    if (existingOrder)
      throw new ConflictException('Order with same payment already exists');
    const orderModel = this.orderRepository.create({
      customer: { id: userId },
      details: order.details,
      payment: { id: order.paymentId },
      status: OrderStatus.PENDING,
    });
    return this.orderRepository.save(orderModel);
  }
}
