import S3, { ClientConfiguration } from "aws-sdk/clients/s3";
import { S3Options } from "builder-util-runtime";
import { PublishContext } from "electron-publish";
import { BaseS3Publisher } from "./BaseS3Publisher";
export default class S3Publisher extends BaseS3Publisher {
    private readonly info;
    readonly providerName: string;
    constructor(context: PublishContext, info: S3Options);
    protected createClientConfiguration(): ClientConfiguration;
    static checkAndResolveOptions(options: S3Options, channelFromAppVersion: string | null): Promise<void>;
    protected getBucketName(): string;
    protected configureS3Options(s3Options: S3.CreateMultipartUploadRequest): void;
}
