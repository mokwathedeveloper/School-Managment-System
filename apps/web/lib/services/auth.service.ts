import * as argon2 from 'argon2';
import { SignJWT, jwtVerify } from 'jose';
import { UsersService } from './users.service';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-key-change-in-production'
);

export const AuthService = {
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await UsersService.findOne(email);
    if (user && await argon2.verify(user.password, pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  },

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role, 
      school_id: user.school_id,
      password_changed: user.password_changed 
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    return {
      access_token: token,
      user: {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          school_id: user.school_id,
          password_changed: user.password_changed
      }
    };
  },

  async verifyToken(token: string) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload;
    } catch (e) {
      return null;
    }
  }
};
