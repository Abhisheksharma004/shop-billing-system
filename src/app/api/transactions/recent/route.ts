import { NextResponse } from 'next/server';
import Transaction from '@/models/Transaction';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    
    // Get recent transactions (last 10)
    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .limit(10)
      .populate('product', 'name')
      .lean();
    
    // Format the transactions for the frontend
    const formattedTransactions = transactions.map(t => ({
      type: t.type,
      productName: t.product.name,
      quantity: t.quantity,
      reason: t.reason,
      date: t.date.toLocaleDateString()
    }));
    
    return NextResponse.json(formattedTransactions);
    
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent transactions' },
      { status: 500 }
    );
  }
}
