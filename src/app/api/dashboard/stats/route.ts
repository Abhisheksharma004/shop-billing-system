import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import Transaction from '@/models/Transaction';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({
      $expr: { $lte: ['$quantity', '$lowStockAlert'] }
    });
    
    // Calculate total stock value
    const products = await Product.find();
    const totalValue = products.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
    
    // Calculate recent sales (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const recentSales = await Transaction.aggregate([
      {
        $match: {
          type: 'out',
          reason: 'sale',
          date: { $gte: oneDayAgo }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $multiply: ['$quantity', '$productDetails.price'] }
          }
        }
      }
    ]);

    const recentSalesTotal = recentSales[0]?.total || 0;

    return NextResponse.json({
      totalProducts,
      lowStockCount: lowStockProducts,
      totalValue,
      recentSales: recentSalesTotal
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
