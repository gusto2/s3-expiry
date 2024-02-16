# S3 presign URL

Generating AWS S3 presigned URL for download and upload.

The URL are generated on the client side, the credentials never leave
the browser

Upload can be done using CURL (or Postman)

```
curl -X PUT -H 'Content-Type: <content-type>' --upload-file <filename> <url>

```


Licence: Apache 2.0
