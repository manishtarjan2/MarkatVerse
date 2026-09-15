export declare class UploadController {
    uploadFiles(files: Array<Express.Multer.File>): {
        message: string;
        urls: string[];
        files: {
            filename: string;
            size: number;
        }[];
    };
}
