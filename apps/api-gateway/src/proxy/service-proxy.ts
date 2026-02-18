import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { Request } from 'express';

function addInternalHeaders(proxyReq: any, req: Request & { user?: any }) {
  if (req.user) {
    proxyReq.setHeader('x-user-id', req.user.id);
    proxyReq.setHeader('x-user-role', req.user.role);
  }
}

export const identityProxy = createProxyMiddleware({
  target: process.env.IDENTITY_SERVICE_URL!,
  changeOrigin: true,
  logger: console,
  on: {
    proxyReq: (proxyReq, req) => {
      fixRequestBody(proxyReq, req);
      addInternalHeaders(proxyReq, req as any);

    },
  },
});

export const profileProxy = createProxyMiddleware({
  target: process.env.PROFILE_SERVICE_URL!,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req) => {
      fixRequestBody(proxyReq, req);
      addInternalHeaders(proxyReq, req as any);
    },
  },
});
