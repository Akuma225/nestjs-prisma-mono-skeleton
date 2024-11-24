export enum AppConfigKey {
    ACCESS_TOKEN_TTL = 'ACCESS_TOKEN_TTL',
    REFRESH_TOKEN_TTL = 'REFRESH_TOKEN_TTL',
    OTP_TTL = 'OTP_TTL',
    ENABLE_2FA = 'ENABLE_2FA',
    ADMIN_VERIFY_MODE = 'ADMIN_VERIFY_MODE',
    USER_VERIFY_MODE = 'USER_VERIFY_MODE',
}

export enum AppConfigKeyVm {
    ACCESS_TOKEN_TTL = "Temps de vie du jeton d'accès",
    REFRESH_TOKEN_TTL = "Temps de vie du jeton de rafraîchissement",
    OTP_TTL = "Temps de vie du jeton OTP",
    ENABLE_2FA = "Activer 2FA",
    ADMIN_VERIFY_MODE = "Mode de vérification de l'administrateur",
    USER_VERIFY_MODE = "Mode de vérification de l'utilisateur",
}