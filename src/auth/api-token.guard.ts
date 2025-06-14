import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  private readonly API_SECRET = 'your-secret-api-key-here';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token =
      request.headers['x-api-key'] || request.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('API token is required');
    }

    const cleanToken = token.replace('Bearer ', '');

    if (cleanToken !== this.API_SECRET) {
      throw new UnauthorizedException('Invalid API token');
    }

    return true;
  }
}
