import { authOptions } from '@/auth/auth-provider';
import NextAuth from 'next-auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 