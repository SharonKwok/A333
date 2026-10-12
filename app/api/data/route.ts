import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET() {
  try {
    // Directly read from app/data/restaurant_customer_satisfaction.csv as requested
    let filePath = path.join(process.cwd(), 'app', 'data', 'restaurant_customer_satisfaction.csv');
    
    if (!fs.existsSync(filePath)) {
      // Fallback to data/restaurant_customer_satisfaction.csv if needed
      filePath = path.join(process.cwd(), 'data', 'restaurant_customer_satisfaction.csv');
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: 'Dataset file not found at app/data/restaurant_customer_satisfaction.csv' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    return NextResponse.json({
      success: true,
      data: parsed.data,
      count: parsed.data.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
