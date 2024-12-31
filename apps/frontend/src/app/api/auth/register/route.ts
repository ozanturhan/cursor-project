import { api } from '@/lib/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Register request:', body);
    
    const { data } = await api.post('/auth/register', body);
    console.log('Register response:', data);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Register error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return NextResponse.json(
        { message: error.response.data.message || 'Registration failed' },
        { status: error.response.status }
      );
    } else if (error.request) {
      // The request was made but no response was received
      return NextResponse.json(
        { message: 'No response from server' },
        { status: 503 }
      );
    } else {
      // Something happened in setting up the request
      return NextResponse.json(
        { message: error.message || 'Internal server error' },
        { status: 500 }
      );
    }
  }
} 