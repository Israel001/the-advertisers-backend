import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { CreateOrderDto, OrderQuery } from './order.dto';
import { Request } from 'express';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreateOrderDto, @Req() request: Request) {
    return this.orderService.createOrder(body, request.user as any);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  fetch(@Query() query: OrderQuery, @Req() request: Request) {
    return this.orderService.fetchOrders(
      query.pagination,
      query.filter,
      request.user as any,
    );
  }

  @Post('/verify-transaction/:transactionId')
  @UseGuards(JwtAuthGuard)
  verifyPayment(
    @Param('transactionId') transactionId: string,
    @Body('amount', ParseIntPipe) amount: number,
  ) {
    return this.orderService.verifyTransaction(
      transactionId,
      amount,
    );
  }
}
