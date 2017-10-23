"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseS3Publisher = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _s;

function _load_s() {
    return _s = _interopRequireDefault(require("aws-sdk/clients/s3"));
}

var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

var _electronPublish;

function _load_electronPublish() {
    return _electronPublish = require("electron-publish");
}

var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _mime;

function _load_mime() {
    return _mime = _interopRequireDefault(require("mime"));
}

var _path = _interopRequireWildcard(require("path"));

var _uploader;

function _load_uploader() {
    return _uploader = require("./uploader");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BaseS3Publisher extends (_electronPublish || _load_electronPublish()).Publisher {
    constructor(context, options) {
        super(context);
        this.options = options;
    }
    configureS3Options(s3Options) {
        // if explicitly set to null, do not add
        if (this.options.acl !== null) {
            s3Options.ACL = this.options.acl || "public-read";
        }
    }
    createClientConfiguration() {
        return { signatureVersion: "v4" };
    }
    // http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html
    upload(task) {
        var _this = this;

        return (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            const fileName = _path.basename(task.file);
            const cancellationToken = _this.context.cancellationToken;
            const target = (_this.options.path == null ? "" : `${_this.options.path}/`) + fileName;
            if (process.env.__TEST_S3_PUBLISHER__ != null) {
                const testFile = _path.join(process.env.__TEST_S3_PUBLISHER__, target);
                yield (0, (_fsExtraP || _load_fsExtraP()).ensureDir)(_path.dirname(testFile));
                yield (0, (_fsExtraP || _load_fsExtraP()).symlink)(task.file, testFile);
                return;
            }
            const s3Options = {
                Key: target,
                Bucket: _this.getBucketName(),
                ContentType: (_mime || _load_mime()).default.getType(task.file) || "application/octet-stream"
            };
            _this.configureS3Options(s3Options);
            const contentLength = task.fileContent == null ? (yield (0, (_fsExtraP || _load_fsExtraP()).stat)(task.file)).size : task.fileContent.length;
            const uploader = new (_uploader || _load_uploader()).Uploader(new (_s || _load_s()).default(_this.createClientConfiguration()), s3Options, task.file, contentLength, task.fileContent);
            const progressBar = _this.createProgressBar(fileName, uploader.contentLength);
            if (progressBar != null) {
                const callback = new (_electronPublish || _load_electronPublish()).ProgressCallback(progressBar);
                uploader.on("progress", function () {
                    if (!cancellationToken.cancelled) {
                        callback.update(uploader.loaded, uploader.contentLength);
                    }
                });
            }
            return yield cancellationToken.createPromise(function (resolve, reject, onCancel) {
                onCancel(function () {
                    return uploader.abort();
                });
                uploader.upload().then(function () {
                    try {
                        (0, (_builderUtil || _load_builderUtil()).debug)(`${_this.providerName} Publisher: ${fileName} was uploaded to ${_this.getBucketName()}`);
                    } finally {
                        resolve();
                    }
                }).catch(reject);
            });
        })();
    }
    toString() {
        return `${this.providerName} (bucket: ${this.getBucketName()})`;
    }
}
exports.BaseS3Publisher = BaseS3Publisher; //# sourceMappingURL=BaseS3Publisher.js.map