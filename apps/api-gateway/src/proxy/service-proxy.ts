import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

export const identityProxy = createProxyMiddleware({
  target: process.env.IDENTITY_SERVICE_URL!, 
  changeOrigin: true,
  logger: console,
  // SEM pathRewrite. O caminho deve passar limpo.
  on: {
    proxyReq: fixRequestBody,
  },
});

export const profileProxy = createProxyMiddleware({
  target: process.env.PROFILE_SERVICE_URL!,
  changeOrigin: true,
  on: {
    proxyReq: fixRequestBody,
  },
});