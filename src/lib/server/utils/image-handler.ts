import path from "path";
import sharp from "sharp";
import crypto from "crypto";
import {promises as fsPromises} from "node:fs";
import pinoLogger from "~/lib/server/core/pino-logger";
import {FormattedError} from "~/lib/server/utils/error-classes";


const IMAGE_SAVE_LOCATION = "./public/static/recipe-images";


interface ResizeOptions {
    width: number;
    height: number;
}


interface ProcessAndSaveImageOptions {
    buffer: Buffer;
    resize?: ResizeOptions;
}


interface SaveUploadedImageOptions {
    file: File;
    resize?: ResizeOptions;
}


export const saveUploadedImage = async ({ file, resize }: SaveUploadedImageOptions) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return processAndSaveImage({ buffer, resize });
    }
    catch (error) {
        throw new FormattedError("This image could not be processed");
    }
};


const processAndSaveImage = async ({ buffer, resize }: ProcessAndSaveImageOptions) => {
    const randomHex = crypto.randomBytes(8).toString("hex");
    const fileName = `${randomHex}.jpg`;

    await fsPromises.mkdir(IMAGE_SAVE_LOCATION, { recursive: true });
    const filePath = path.join(IMAGE_SAVE_LOCATION, fileName);

    const sharpInstance = sharp(buffer);
    if (resize) {
        sharpInstance.resize(resize.width, resize.height);
    }

    await sharpInstance.jpeg({ quality: 90 }).toFile(filePath);

    return fileName;
};


export const deleteImage = async (imageName: string | null | undefined) => {
    if (!imageName || imageName === "default.png") return;

    try {
        const imagePath = path.join(process.cwd(), IMAGE_SAVE_LOCATION, imageName);
        await fsPromises.unlink(imagePath);
    }
    catch (err: any) {
        if (err.code !== "ENOENT") {
            pinoLogger.error({ error: err, imageName }, `Failed to delete image ${imageName}:`);
        }
    }
};