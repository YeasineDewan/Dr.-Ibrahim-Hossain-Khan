import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, verifyRefreshToken } from './tokens';

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const request = req as NextRequest & { user: typeof decoded };
    (request as any).user = decoded;

    return handler(request);
  };
}

export function withOptionalAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    const request = req as NextRequest & { user: ReturnType<typeof verifyAccessToken> };
    if (token) {
      const decoded = verifyAccessToken(token);
      (request as any).user = decoded;
    } else {
      (request as any).user = null;
    }

    return handler(request);
  };
}
