import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('interstate/routes')
export class RouteController {
  
  // Hardcoded for mock purposes. In production, these are stored in PostgreSQL.
  private routes = [
    { id: 'RT_001', from: 'Lagos', to: 'Abuja', basePrice: 25000, estimatedHours: 10 },
    { id: 'RT_002', from: 'Lagos', to: 'Port Harcourt', basePrice: 22000, estimatedHours: 9 },
    { id: 'RT_003', from: 'Abuja', to: 'Kano', basePrice: 15000, estimatedHours: 6 },
  ];

  @Get()
  getAllRoutes() {
    return this.routes;
  }

  // Admin endpoint to add new fixed routes
  @Post()
  createRoute(@Body() data: any) {
    const newRoute = { id: `RT_00${this.routes.length + 1}`, ...data };
    this.routes.push(newRoute);
    return newRoute;
  }
}
