import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AdminProfile } from "../enums/admin-profile.enum";
import { AdminAuthenticationGuard } from "../guards/admin-authentication.guard";
import { AdminAuthorizationGuard } from "../guards/admin-authorization.guard";

export function IsAdminAuthenticated(profiles?: AdminProfile[]) {
    
    if (profiles) {
        return applyDecorators(
            SetMetadata('REQUIRED_ADMIN_PROFILES', profiles),
            UseGuards(AdminAuthenticationGuard, AdminAuthorizationGuard)
        );
    }

    return applyDecorators(UseGuards(AdminAuthenticationGuard));
}