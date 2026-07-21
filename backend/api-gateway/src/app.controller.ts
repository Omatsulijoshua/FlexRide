import { Controller, All, Req, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @All('*')
  async proxy(@Req() req: any, @Res() res: any) {
    const path = req.path;
    const cleanPath = path.replace(/^\/v1/, '');

    const isDockerOrRender = process.env.RENDER === 'true' || process.env.DOCKER_ENV === 'true';
    const defaultHost = (serviceName: string) => isDockerOrRender ? serviceName : 'localhost';

    let targetPort = 3000;
    let targetHost = 'localhost';

    if (cleanPath.startsWith('/auth')) {
      targetPort = 3001;
      targetHost = process.env.AUTH_SERVICE_HOST || defaultHost('auth-service');
    } else if (cleanPath.startsWith('/users')) {
      targetPort = 3002;
      targetHost = process.env.USER_SERVICE_HOST || defaultHost('user-service');
    } else if (cleanPath.startsWith('/driver')) {
      targetPort = 3003;
      targetHost = process.env.DRIVER_SERVICE_HOST || defaultHost('driver-service');
    } else if (cleanPath.startsWith('/rides')) {
      targetPort = 3004;
      targetHost = process.env.RIDE_SERVICE_HOST || defaultHost('ride-service');
    } else if (cleanPath.startsWith('/tracking')) {
      targetPort = 3005;
      targetHost = process.env.TRACKING_SERVICE_HOST || defaultHost('tracking-service');
    } else if (cleanPath.startsWith('/payment') || cleanPath.startsWith('/wallet')) {
      targetPort = 3006;
      targetHost = process.env.PAYMENT_SERVICE_HOST || defaultHost('payment-service');
    } else if (cleanPath.startsWith('/dispatch')) {
      targetPort = 3007;
      targetHost = process.env.DISPATCH_SERVICE_HOST || defaultHost('dispatch-service');
    } else if (cleanPath.startsWith('/interstate')) {
      targetPort = 3008;
      targetHost = process.env.INTERSTATE_SERVICE_HOST || defaultHost('interstate-service');
    } else if (cleanPath.startsWith('/notifications')) {
      targetPort = 3009;
      targetHost = process.env.NOTIFICATION_SERVICE_HOST || defaultHost('notification-service');
    } else if (cleanPath.startsWith('/analytics')) {
      targetPort = 3011;
      targetHost = process.env.ANALYTICS_SERVICE_HOST || defaultHost('analytics-service');
    } else if (cleanPath.startsWith('/fraud')) {
      targetPort = 3012;
      targetHost = process.env.FRAUD_SERVICE_HOST || defaultHost('fraud-service');
    } else {
      return res.status(200).send('Server is Running');
    }

    const queryParams = new URLSearchParams(req.query as any).toString();
    const queryString = queryParams ? `?${queryParams}` : '';
    const targetUrl = `http://${targetHost}:${targetPort}${path}${queryString}`;

    try {
      const headers = new Headers();
      Object.entries(req.headers).forEach(([key, val]) => {
        if (val) {
          headers.append(key, String(Array.isArray(val) ? val.join(', ') : val));
        }
      });
      headers.set('host', `${targetHost}:${targetPort}`);

      const fetchOptions: RequestInit = {
        method: req.method,
        headers: headers,
      };

      if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && Object.keys(req.body).length > 0) {
        fetchOptions.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);

      res.status(response.status);
      response.headers.forEach((val, key) => {
        res.setHeader(key, val);
      });

      const bodyText = await response.text();
      return res.send(bodyText);
    } catch (error: any) {
      return res.status(500).json({
        statusCode: 500,
        message: `Gateway Error: ${error.message}`,
      });
    }
  }
}
