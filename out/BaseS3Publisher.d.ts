import { ClientConfiguration, CreateMultipartUploadRequest } from "aws-sdk/clients/s3";
import { BaseS3Options } from "builder-util-runtime";
import { PublishContext, Publisher, UploadTask } from "electron-publish";
export declare abstract class BaseS3Publisher extends Publisher {
    private options;
    constructor(context: PublishContext, options: BaseS3Options);
    protected abstract getBucketName(): string;
    protected configureS3Options(s3Options: CreateMultipartUploadRequest): void;
    protected createClientConfiguration(): ClientConfiguration;
    upload(task: UploadTask): Promise<any>;
    toString(): string;
}
