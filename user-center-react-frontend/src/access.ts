/**
 * @see https://umijs.org/docs/max/access#access
 * */
import { USER_ROLE } from "@/constants/user";
import type { AuthState } from "@/stores/auth";

export default function access(
  initialState:
    | {
        auth?: AuthState;
      }
    | undefined,
) {
  const currentUser = initialState?.auth?.user;
  return {
    canAdmin: currentUser?.userRole === USER_ROLE.ADMIN,
  };
}
