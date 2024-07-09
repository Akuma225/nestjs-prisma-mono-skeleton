import { HttpException, Injectable } from '@nestjs/common';
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
                is_first_login: true
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
