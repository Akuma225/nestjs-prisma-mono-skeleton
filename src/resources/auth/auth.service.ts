import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/services/prisma.service';
import * as bcrypt from 'bcrypt'
import { SecurityService } from 'src/commons/services/security.service';
import { Profile } from 'src/commons/enums/profile.enum';
import { UserData } from 'src/commons/shared/entities/user-data.entity';
import { AccessTokenData } from 'src/commons/shared/entities/access-token-data.entity';
import { RandomService } from 'src/commons/services/random.service';
import { RegistrationDTO } from './dtos/registration.dto';
import { ConfigService } from '@nestjs/config';
import { ActivateAccountDTO } from './dtos/activate-account.dto';
import { ResetActivationOtpDTO } from './dtos/resend-activation-otp.dto';
import { RequestResetPasswordDTO } from './dtos/request-reset-password.dto';
import { ConfirmResetPasswordDTO } from './dtos/confirm-reset-password.dto';
import { ResetPasswordDTO } from './dtos/reset-password.dto';
import { ResendResetPasswordOtpDTO } from './dtos/resend-reset-password-otp.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
        private readonly securityService: SecurityService,
        private readonly randomService: RandomService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.findUserByEmail(email);

        if (!user) {
            throw new HttpException("Adresse email ou mot de passe incorrect", 401);
        }

        const isPasswordMatching = await this.checkPassword(password, user.password);

        if (!isPasswordMatching) {
            throw new HttpException("Adresse email ou mot de passe incorrect", 401);
        }

        if (!user.is_active) {
            throw new HttpException("Votre compte est désactivé", 401);
        }

        // Update auto login token
        await this.updateAutoLoginToken(user.id);

        // Update activation token & code
        const activationData = await this.updateActivationToken(user.id)

        if (activationData) {
            return {
                id: user.id,
                activation_token: activationData.activationToken,
                expires_in: activationData.expirationSeconds
            }
        }

        // Generate access and refresh tokens
        return await this.createAccessTokenAndRefreshToken(user.id);
    }

    async registerUser(data: RegistrationDTO) {
        const createdUser = await this.prismaService.users.create({
            data: {
                email: data.email,
                firstname: data.firstname,
                lastname: data.lastname,
                contact: data.contact,
                profile: Profile[data.profile],
                password: await bcrypt.hash(data.password, 10),
                is_active: true,
                is_first_login: false
            }
        });

        const ACCOUNT_ACTIVATION_ENABLED = this.configService.get("ACCOUNT_ACTIVATION_ENABLED") === 'true';

        if (ACCOUNT_ACTIVATION_ENABLED) {
            const activationData = await this.updateActivationToken(createdUser.id)

            if (activationData) {
                return {
                    id: createdUser.id,
                    activation_token: activationData.activationToken,
                    expires_in: activationData.expirationSeconds
                }
            }
        }
        else {
            // Activate user account
            await this.prismaService.users.update({
                where: {
                    id: createdUser.id
                },
                data: {
                    mail_verified_at: new Date()
                }
            })
        }

        return await this.createAccessTokenAndRefreshToken(createdUser.id);
    }

    async activateAccount(data: ActivateAccountDTO) {
        const user = await this.prismaService.users.findUnique({
            where: {
                id: data.id,
                activation_token: data.activation_token,
            }
        });

        if (!user) {
            throw new HttpException("Token d'activation invalide", 401);
        }

        if (user.mail_verified_at) {
            throw new HttpException("Compte déjà activé", 401);
        }

        if (user.activation_expires_at && user.activation_expires_at < new Date()) {
            throw new HttpException("Token d'activation expiré", 401);
        }

        if (user.activation_code !== data.activation_code) {
            throw new HttpException("Code d'activation invalide", 401);
        }

        // Activate user account
        await this.prismaService.users.update({
            where: {
                id: user.id
            },
            data: {
                mail_verified_at: new Date(),
                activation_token: null,
                activation_code: null,
                activation_expires_at: null
            }
        })

        return await this.createAccessTokenAndRefreshToken(user.id);
    }

    async resendActivationOtp(data: ResetActivationOtpDTO) {
        const user = await this.prismaService.users.findUnique({
            where: {
                id: data.id,
                activation_token: data.activation_token,
            }
        });

        if (!user) {
            throw new HttpException("Token d'activation invalide", 401);
        }

        const activationData = await this.updateActivationToken(user.id)

        if (activationData) {
            return {
                id: user.id,
                activation_token: activationData.activationToken,
                expires_in: activationData.expirationSeconds
            }
        }

        throw new HttpException("Compte déjà activé", 401);
    }

    async refreshTokens(refreshToken: string) {
        const ACCOUNT_ACTIVATION_ENABLED = this.configService.get("ACCOUNT_ACTIVATION_ENABLED") === 'true';

        const payload: any = this.securityService.verifyJwt(
            refreshToken,
            this.configService.get('REFRESH_TOKEN_SECRET')
        );

        if (!payload) {
            throw new HttpException("Token invalide", 401);
        }

        const user = await this.findUserById(payload.sub.id);

        if (!user) {
            throw new HttpException("Utilisateur introuvable", 401);
        }

        if (!user.is_active) {
            throw new HttpException("Votre compte est désactivé", 401);
        }

        if (ACCOUNT_ACTIVATION_ENABLED && !user.mail_verified_at) {
            throw new HttpException("Votre compte n'est pas activé", 401);
        }

        if (user.auto_login_token !== payload.sub.auto_login_token) {
            throw new HttpException("Token invalide", 401);
        }

        // Update auto login token
        await this.updateAutoLoginToken(user.id);

        // Generate access and refresh tokens
        return await this.createAccessTokenAndRefreshToken(user.id);
    }

    async revokeToken(userId: string) {
        await this.prismaService.users.update({
            where: {
                id: userId
            },
            data: {
                auto_login_token: null
            }
        })
    }

    async requestResetPassword(data: RequestResetPasswordDTO) {
        const user = await this.findUserByEmail(data.email);
        const PASSWORD_RESET_TOKEN_LENGTH = +this.configService.get("PASSWORD_RESET_TOKEN_LENGTH") || 32;
        const PASSWORD_RESET_CODE_LENGTH = +this.configService.get("PASSWORD_RESET_CODE_LENGTH") || 6;
        const PASSWORD_RESET_LIMIT_ENABLED = this.configService.get("PASSWORD_RESET_LIMIT_ENABLED") === 'true';
        const PASSWORD_RESET_TOKEN_EXPIRE = +this.configService.get("PASSWORD_RESET_TOKEN_EXPIRE") || 300;

        if (PASSWORD_RESET_LIMIT_ENABLED) {
            // Check if there isn't a pending password reset request
            const pendingRequest = await this.prismaService.password_resets.findFirst({
                where: {
                    user_id: user.id,
                    expires_at: {
                        gt: new Date()
                    },
                    confirmed_at: null,
                    password_changed_at: null
                }
            });

            if (pendingRequest) {
                // Calculate remaining time
                const remainingTime = Math.floor((pendingRequest.expires_at.getTime() - Date.now()) / 1000);

                throw new HttpException(`Un email a déjà été envoyé. Veuillez patienter ${remainingTime} secondes avant de pouvoir en demander un autre.`, HttpStatus.TOO_MANY_REQUESTS);
            }
        }

        const passwordResetToken = this.randomService.randomToken(PASSWORD_RESET_TOKEN_LENGTH);
        const passwordResetCode = this.randomService.randomOtp(PASSWORD_RESET_CODE_LENGTH);
        const passwordResetExpireAt = PASSWORD_RESET_TOKEN_EXPIRE !== -1 ? new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRE * 1000) : null;

        const request = await this.prismaService.password_resets.create({
            data: {
                user_id: user.id,
                token: passwordResetToken,
                code: passwordResetCode,
                expires_at: passwordResetExpireAt
            }
        });

        // Send Notification by Email with OTP Code (TODO)

        // Return password reset data
        return {
            id: request.id,
            token: passwordResetToken,
            expires_in: PASSWORD_RESET_TOKEN_EXPIRE
        };
    }

    async confirmResetPassword(data: ConfirmResetPasswordDTO) {
        const request = await this.prismaService.password_resets.findFirst({
            where: {
                id: data.id
            }
        });

        if (request.token !== data.token) {
            throw new HttpException("Token invalide", 401);
        }

        if (request.expires_at < new Date()) {
            throw new HttpException("Token expiré", 401);
        }

        if (request.confirmed_at || request.password_changed_at) {
            throw new HttpException("Token déjà utilisé", 401);
        }

        if (request.code !== data.code) {
            throw new HttpException("Code invalide", 401);
        }

        // Update password reset request
        await this.prismaService.password_resets.update({
            where: {
                id: request.id
            },
            data: {
                confirmed_at: new Date()
            }
        });

        return {
            id: request.id,
            token: request.token
        };
    }

    async resetPassword(data: ResetPasswordDTO) {
        const request = await this.prismaService.password_resets.findFirst({
            where: {
                id: data.id
            }
        });

        if (!request.confirmed_at) {
            throw new HttpException("Veuillez confirmer votre demande de réinitialisation de mot de passe", 401);
        }

        if (request.password_changed_at) {
            throw new HttpException("Token déjà utilisé", 401);
        }

        // Update user password
        await this.prismaService.users.update({
            where: {
                id: request.user_id
            },
            data: {
                password: await bcrypt.hash(data.new_password, 10)
            }
        });

        // Update password reset request
        await this.prismaService.password_resets.update({
            where: {
                id: request.id
            },
            data: {
                password_changed_at: new Date()
            }
        });

        return;
    }

    async resendResetPasswordOtp(data: ResendResetPasswordOtpDTO) {
        const request = await this.prismaService.password_resets.findFirst({
            where: {
                id: data.id
            }
        });

        if (request.password_changed_at) {
            throw new HttpException("Token déjà utilisé", 401);
        }

        const PASSWORD_RESET_TOKEN_LENGTH = +this.configService.get("PASSWORD_RESET_TOKEN_LENGTH") || 32;
        const PASSWORD_RESET_CODE_LENGTH = +this.configService.get("PASSWORD_RESET_CODE_LENGTH") || 6;
        const PASSWORD_RESET_TOKEN_EXPIRE = +this.configService.get("PASSWORD_RESET_TOKEN_EXPIRE") || 300;

        const passwordResetToken = this.randomService.randomToken(PASSWORD_RESET_TOKEN_LENGTH);
        const passwordResetCode = this.randomService.randomOtp(PASSWORD_RESET_CODE_LENGTH);
        const passwordResetExpireAt = PASSWORD_RESET_TOKEN_EXPIRE !== -1 ? new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRE * 1000) : null;

        await this.prismaService.password_resets.update({
            where: {
                id: request.id
            },
            data: {
                token: passwordResetToken,
                code: passwordResetCode,
                expires_at: passwordResetExpireAt
            }
        });

        // Send Notification by Email with OTP Code (TODO)

        // Return password reset data
        return {
            id: request.id,
            token: passwordResetToken,
            expires_in: PASSWORD_RESET_TOKEN_EXPIRE
        };
    }

    async findUserByEmail(email: string) {
        return this.prismaService.users.findUnique({
            where: {
                email,
            },
        });
    }

    async findUserById(id: string) {
        return this.prismaService.users.findUnique({
            where: {
                id,
            },
        });
    }

    async checkPassword(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword);
    }

    async createAccessTokenAndRefreshToken(userId) {
        const user = await this.prismaService.users.findFirst({
            where: {
                id: userId
            }
        })

        const userData: UserData = {
            firstname: user.firstname,
            lastname: user.lastname,
            profile: Profile[user.profile],
            email: user.email,
            is_first_login: user.is_first_login,
            contact: user.contact,
            id: user.id,
            is_active: user.is_active,
            auto_login_token: user.auto_login_token,
            mail_verified_at: user.mail_verified_at,
            created_at: user.created_at,
            updated_at: user.updated_at,
            deleted_at: user.deleted_at
        }

        const payloadAT: AccessTokenData = {
            sub: userData
        }
        const payloadRT = {
            sub: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                auto_login_token: user.auto_login_token,
            }
        }

        return {
            access_token: this.securityService.signJwt(
                payloadAT,
                this.configService.get('ACCESS_TOKEN_SECRET'),
                this.configService.get('ACCESS_TOKEN_EXPIRE')
            ),
            refresh_token: this.securityService.signJwt(
                payloadRT,
                this.configService.get('REFRESH_TOKEN_SECRET'),
                this.configService.get('REFRESH_TOKEN_EXPIRE')
            ),
        }
    }

    async updateAutoLoginToken(userId) {
        const AUTO_LOGIN_TOKEN_LENGTH = +this.configService.get("AUTO_LOGIN_TOKEN_LENGTH") || 16;

        const autoLoginToken = this.randomService.randomToken(AUTO_LOGIN_TOKEN_LENGTH);

        await this.prismaService.users.update({
            where: {
                id: userId
            },
            data: {
                auto_login_token: autoLoginToken
            }
        })
    }

    async updateActivationToken(userId) {
        const user = await this.findUserById(userId);

        if (!user.mail_verified_at) {
            const ACTIVATION_TOKEN_LENGTH = +this.configService.get("ACTIVATION_TOKEN_LENGTH") || 16;
            const ACTIVATION_CODE_LENGTH = +this.configService.get("ACTIVATION_CODE_LENGTH") || 6;
            const ACTIVATION_TOKEN_EXPIRE = +this.configService.get("ACTIVATION_TOKEN_EXPIRE") || 300;

            const activationToken = this.randomService.randomToken(ACTIVATION_TOKEN_LENGTH);
            const activationCode = this.randomService.randomOtp(ACTIVATION_CODE_LENGTH);
            const activationExpireAt = ACTIVATION_TOKEN_EXPIRE !== -1 ? new Date(Date.now() + ACTIVATION_TOKEN_EXPIRE * 1000) : null;

            await this.prismaService.users.update({
                where: {
                    id: userId
                },
                data: {
                    activation_token: activationToken,
                    activation_code: activationCode,
                    activation_expires_at: activationExpireAt
                }
            })

            // Send Notification by Email with OTP Code (TODO)

            // Return activation data
            return {
                activationToken,
                expirationSeconds: ACTIVATION_TOKEN_EXPIRE
            };
        }

        return null;
    }
}
