import { AppConfigKey } from "../enums/app-config-key.enum";
import { VerifyModeOptions } from "../enums/verify-mode-options.enum";

export const DefaultAppConfigs = [
    {
        key: AppConfigKey.ACCESS_TOKEN_TTL,
        value: '7d'
    },
    {
        key: AppConfigKey.REFRESH_TOKEN_TTL,
        value: '14d'
    },
    {
        key: AppConfigKey.OTP_TTL,
        value: 60000 * 5 // 5 minutes
    },
    {
        key: AppConfigKey.ENABLE_2FA,
        value: false
    },
    {
        key: AppConfigKey.ADMIN_VERIFY_MODE,
        value: VerifyModeOptions.LOGIN_BLOCKED_WHILE_VERIFYING
    },
    {
        key: AppConfigKey.USER_VERIFY_MODE,
        value: VerifyModeOptions.LOGIN_ALLOWED_WHILE_VERIFYING
    }
]