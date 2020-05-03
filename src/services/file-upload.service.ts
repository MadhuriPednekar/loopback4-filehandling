import { inject, Provider } from '@loopback/core';
import { getService } from '@loopback/service-proxy';
import { FileUploadDataSource } from '../datasources';

export interface FileUpload {
	// this is where you define the Node.js methods that will be
	// mapped to REST/SOAP/gRPC operations as stated in the datasource
	// json file.

	//upload file to another rest api
	uploadFile(file: Object): Promise<string>;
}

export class FileUploadProvider implements Provider<FileUpload> {
	constructor(
		// FileUpload must match the name property in the datasource json file
		@inject('datasources.FileUpload') protected dataSource: FileUploadDataSource = new FileUploadDataSource()
	) {}

	value(): Promise<FileUpload> {
		return getService(this.dataSource);
	}
}
