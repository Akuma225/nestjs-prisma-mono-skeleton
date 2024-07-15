
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StorageService } from '../services/storage.service';
import { ConfigService } from '@nestjs/config';
import { FilePath } from '../enums/file_path.enum';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class DeleteNonUsedFilesCron {

    constructor(
        private readonly storageService: StorageService,
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_8AM)
    handleCron() {
        Logger.log('Deleting non-used files...');
        const DELETE_NON_USED_IMAGES_CRON = this.configService.get<boolean>('DELETE_NON_USED_IMAGES_CRON');

        if (DELETE_NON_USED_IMAGES_CRON) {
            this.deleteNonUsedImagesProducts();
        }
    }

    async deleteNonUsedImagesProducts() {
        Logger.log('Deleting non-used images products...');
        const storagePath = process.cwd() + FilePath.PRODUCT_IMAGE_PATH;

        const files = await this.storageService.getFiles(storagePath);

        Logger.log("Files Found: " + files.length);

        let deletedFilesCount = 0;

        for (const file of files) {
            const fileName = file.split('/').pop();
            const product = await this.prismaService.products.findFirst({
                where: {
                    image: fileName
                }
            });

            if (!product) {
                Logger.log("Deleting file: " + file);
                await this.storageService.deleteFile(storagePath, fileName);
                deletedFilesCount++;
            }

        }

        Logger.log("Deleted Files: " + deletedFilesCount);
        Logger.log("Cron job finished.");
    }
}