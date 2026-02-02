import { UserRole } from '../../../domain/enums/user-role.enum';
import { UserStatus } from '../../../domain/enums/user-status.enum';
import { USER_ROLE, USER_STATUS } from '@prisma/client';

export class UserPrismaMapper {

  static toDomainRole(role: USER_ROLE): UserRole {
    return UserRole[role];
  }

  static toDomainStatus(status: USER_STATUS): UserStatus {
    return UserStatus[status];
  }
  
}
