
export class UploadFilesComponentOptions {
  /**
   * URL of the REST endpoint for file upload.
   */
  url: string;

  authToken: string;

  disableMultipart = false;

  itemAlias: string;
}
