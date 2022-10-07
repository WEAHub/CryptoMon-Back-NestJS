import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlertsService } from '../services/alerts.service';

@Controller('alerts')
@UseGuards(AuthGuard('jwt'))
export class AlertsController {

  constructor(
    private alertsService: AlertsService
  ) {}

  @Get('/getAlerts')
  async getAlerts(@Request() req) {
    const alerts = this.alertsService.getAlerts(req.user)
    return {
     alerts
    }
  }

}
