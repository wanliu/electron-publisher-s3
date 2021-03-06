/// <reference types="node" />
import { S3 } from "aws-sdk";
import { CreateMultipartUploadRequest } from "aws-sdk/clients/s3";
import { EventEmitter } from "events";
export declare class Uploader extends EventEmitter {
    private readonly s3;
    private readonly s3Options;
    private readonly localFile;
    readonly contentLength: number;
    private readonly fileContent;
    /** @readonly */
    loaded: number;
    private cancelled;
    readonly s3RetryCount: number;
    readonly s3RetryDelay: number;
    readonly multipartUploadThreshold: number;
    readonly multipartUploadSize: number;
    readonly multipartDownloadThreshold: number;
    readonly multipartDownloadSize: number;
    constructor(s3: S3, s3Options: CreateMultipartUploadRequest, localFile: string, contentLength: number, fileContent: Buffer | null | undefined);
    upload(): Promise<void>;
    abort(): void;
    private putObject(md5);
    private multipartUpload(uploadId, multipartUploadSize);
    private makeUploadPart(part, uploadId);
    private runOrRetry<T>(task);
}
