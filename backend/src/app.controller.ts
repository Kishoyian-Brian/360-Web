import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('seed-database')
  async seedDatabase() {
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execAsync = util.promisify(exec);
      
      console.log('🌱 Manually triggering database seed...');
      const { stdout, stderr } = await execAsync('npm run db:seed:simple');
      
      console.log('Seed output:', stdout);
      if (stderr) console.error('Seed errors:', stderr);
      
      return { 
        message: 'Database seeding completed', 
        output: stdout,
        errors: stderr 
      };
    } catch (error) {
      console.error('Seed failed:', error);
      return { 
        message: 'Database seeding failed', 
        error: error.message 
      };
    }
  }
}
