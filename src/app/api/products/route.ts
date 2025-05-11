import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import { connectDB } from '@/lib/db';

export async function GET() {  try {
    await connectDB();
    
    // Get all products with their current stock levels
    const products = await Product.find().select('name sku quantity lowStockAlert category price');
    
    return NextResponse.json(products);
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
