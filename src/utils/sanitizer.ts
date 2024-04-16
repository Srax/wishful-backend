import { UserDTO } from "../dto/user/user.dto";
import { User } from "../entities/User.entity";

export const sanitizeUser = (user: User): UserDTO => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role.name,
  };
};
