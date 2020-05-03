import { inject, service } from '@loopback/core';
import { post, Request, requestBody, Response, RestBindings } from '@loopback/rest';
import { createReadStream, writeFileSync } from 'fs';
import multer from 'multer';
import { FileUpload, FileUploadProvider } from '../services';

export class FileController {
	constructor(@service(FileUploadProvider) private fileUploadService: FileUpload) {}

	@post('/file/upload', {
		responses: {
			200: {
				content: {
					'application/json': {
						schema: {
							type: 'string'
						}
					}
				},
				description: 'Uploaded file content'
			}
		}
	})
	async fileUpload(
		@requestBody.file() request: Request,
		@inject(RestBindings.Http.RESPONSE) response: Response
	): Promise<string> {
		const fields = multer();
		return new Promise<string>((resolve, reject) => {
			fields.single('file')(request, response, (err: Error) => {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					if (!!request.file && !!request.file.buffer) {
						resolve(request.file.buffer.toString());
					} else reject('File not found');
				}
			});
		});
	}

	@post('/file/upload/externalApi', {
		responses: {
			200: {
				content: {
					'application/json': {
						schema: {
							type: 'string'
						}
					}
				},
				description: 'Uploads file to a rest api and returns the api response'
			}
		}
	})
	async fileUploadToExternalApi(
		@requestBody.file({ description: 'Accepts a file to be uploaded to another rest api' })
		request: Request,
		@inject(RestBindings.Http.RESPONSE) response: Response
	): Promise<string> {
		const fields = multer();
		return new Promise<string>((resolve, reject) => {
			fields.single('file')(request, response, async (err: Error) => {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					if (!!request.file && !!request.file.buffer) {
						//Convert file content into ReadStream
						writeFileSync(`fileToBeUploaded.json`, request.file.buffer.toString());
						const readStream = createReadStream(`fileToBeUploaded.json`);
						//Upload file to another rest api : /file/upload
						const apiResponse: string = await this.fileUploadService.uploadFile(readStream);
						resolve(apiResponse);
					} else reject('File not found');
				}
			});
		});
	}
}
