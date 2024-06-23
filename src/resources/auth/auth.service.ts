import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/services/prisma.service';
import * as bcrypt from 'bcrypt'
import { SecurityService } from 'src/commons/services/security.service';
import { Profile } from 'src/commons/enums/profile.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly securityService: SecurityService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.findUserByEmail(email);

        if (!user) {
            return new HttpException("Adresse email ou mot de passe incorrect", 401);
        }

        const isPasswordMatching = await this.checkPassword(password, user.password);

        if (!isPasswordMatching) {
            return new HttpException("Adresse email ou mot de passe incorrect", 401);
        }

        // Generate access and refresh tokens

        return await this.createAccessTokenAndRefreshToken(user.id);
    }

    async findUserByEmail(email: string) {
        return this.prismaService.users.findUnique({
            where: {
                email,
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

        const payloadAT = {
            firstname: user.firstname,
            lastname: user.lastname,
            profile: Profile[user.profile],
            email: user.email,
            is_first_login: user.is_first_login,
            sub: user.id,
        }
        const payloadRT = {
            sub: user.id,
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        }

        return {
            access_token: this.securityService.signJwt(
                payloadAT,
                process.env.JWT_SECRET,
                '1d'
            ),
            refresh_token: this.securityService.signJwt(
                payloadRT,
                process.env.JWT_SECRET,
                '7d'
            ),
        }
    }
}
