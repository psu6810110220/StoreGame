import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/user.entity';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    // ฟังก์ชันตัดสินใจว่าจะให้ผ่านหรือไม่ (True=ผ่าน, False=ห้ามเข้า)
    canActivate(context: ExecutionContext): boolean {
        // 1. อ่านค่า Role ที่ต้องการจาก Decorator @Roles(...)
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(), // อ่านจากระดับ Function
            context.getClass(),   // อ่านจากระดับ Class
        ]);

        // ถ้าไม่ได้ระบุว่าต้องเป็น Role อะไร -> ปล่อยผ่านได้เลย
        if (!requiredRoles) {
            return true;
        }

        // 2. ดึงข้อมูล User จาก Request (ได้มาจาก JwtStrategy)
        const { user } = context.switchToHttp().getRequest();

        // 3. ตรวจว่า Role ของ User ตรงกับที่ระบุไหม
        // เช่น ถ้าต้องการ ADMIN แต่ User เป็น USER -> return false
        return requiredRoles.some((role) => user.role === role);
    }
}
