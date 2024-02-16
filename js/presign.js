/*
 * Author: Gabriel Vince
 * Licence: GPL
 * version 1.0
 */
            
            /*
             * Fill the region dropdown
             * @param {type} regionList
             * @returns void
             */
            const fillListOfRegions = (regionList) => {
                
                let regionDropdown = document.getElementById("AWS_REGION");
                regionList.forEach(region => {
                    var opt = document.createElement('option');
                    opt.value = region.key;
                    opt.innerHTML = region.name;
                    regionDropdown.appendChild(opt);
                });
            };
            
            /**
             * parse the url and get the bucket and key
             * assuming the proper s3 url naming
             * @returns an abject {Bucket, Key}
             */
            const extractS3BucketAndKey = (s3url) => {
                bucketNameIndex = 5; // "s3://"
                keyIndex = s3url.indexOf('/', 7); // bucket name must have at least 3 chars
                
                let s3props = {
                    Bucket: s3url.substring(bucketNameIndex, keyIndex),
                    Key: s3url.substring(keyIndex+1)
                };
                return s3props;
            }
            
            /*
             * 
             * @returns a strcture with filled form
             */
            const getRequestData = () => {
                let s3Url = document.getElementById('S3_URL').value.trim();
                // validate s3
                // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
                const s3UrlRegexp = new RegExp('^s3:\\/\\/[a-z0-9\\.\\-\\_]{3,63}(/[a-zA-Z0-9!_.*\\\'()-]+)+');
                if(!s3UrlRegexp.test(s3Url)) {
                    throw new Error('Invalid S3 url');
                }
                // validate expires in
                let expiresIn = parseInt(document.getElementById('EXPIRES').value);
                if(expiresIn<0 || expiresIn > 604800 /* max expires is a week */) {
                    throw new Error('Expiration must be between 0 and 604800');
                }
                // extract bucket and key
                let s3Props = extractS3BucketAndKey(s3Url);
                let reqData =  {
                    awsAccessKey: document.getElementById('AWS_ACCESS_KEY').value,
                    awsAccessSecretKey: document.getElementById('AWS_ACCESS_SECRET_KEY').value,
                    awsRegion: document.getElementById('AWS_REGION').value,
                    bucket: s3Props.Bucket,
                    key: s3Props.Key,
                    expiresIn: expiresIn,
                    action: document.getElementById('action').value
                };
                return reqData;
            };
            
            const setErrorText = (errText) => {
              document.getElementById("alertText").innerHTML = errText; 
            };
            
            const setMethodAndUrl = (method, url) => {
                document.getElementById('method').innerHTML=method;
                let link = null;
                let urlElement = document.getElementById('url');
                urlElement.innerHTML='';
                if(url) {
                  link = document.createElement('a');
                  var linkText = document.createTextNode(url);
                  //link.setAttribute("href", url);
                  link.href=url;
                  link.target="_blank";
                  link.appendChild(linkText);
                  urlElement.appendChild(link);
                }
            };
            
            async function presignS3Url() {
              try {
                  
                  setErrorText(null);
                  let reqData = getRequestData();
                  var s3 = new AWS.S3({
                      accessKeyId: reqData.awsAccessKey,
                      secretAccessKey: reqData.awsAccessSecretKey,
                      region: reqData.awsRegion,
                  });
                  let url = s3.getSignedUrl(
                    reqData.action==="download"?"getObject":"putObject",
                    {
                        Expires: reqData.expiresIn,
                        Bucket: reqData.bucket,
                        Key: reqData.key
                    }
                  );
                  setMethodAndUrl(
                    reqData.action==="download"?"GET":"PUT",
                    url
                    );
              } catch(err) {
                  console.error(err);
                  setErrorText(err);
              }
            };
            
            
            
            /* ================================================= */

            document.getElementById("presignButton")
                    .addEventListener('click', (event)=> {
                        presignS3Url();
                    });

            // https://docs.aws.amazon.com/general/latest/gr/rande.html#regional-endpoints
            let regions = [
                { key: 'us-east-2', name: 'US East (Ohio)'}, 
                { key: 'us-east-1', name: 'US East (N. Virginia)'}, 
                { key: 'us-west-1', name: 'US West (N. California)'}, 
                { key: 'us-west-2', name: 'US West (Oregon)'}, 
                { key: 'af-south-1', name: 'Africa (Cape Town)'}, 
                { key: 'ap-east-1', name: 'Asia Pacific (Hong Kong)'}, 
                { key: 'ap-south-2', name: 'Asia Pacific (Hyderabad)'}, 
                { key: 'ap-southeast-3', name: 'Asia Pacific (Jakarta)'}, 
                { key: 'ap-southeast-4', name: 'Asia Pacific (Melbourne)'}, 
                { key: 'ap-south-1', name: 'Asia Pacific (Mumbai)'}, 
                { key: 'ap-northeast-3', name: 'Asia Pacific (Osaka)'}, 
                { key: 'ap-northeast-2', name: 'Asia Pacific (Seoul)'}, 
                { key: 'ap-southeast-1', name: 'Asia Pacific (Singapore)'}, 
                { key: 'ap-southeast-2', name: 'Asia Pacific (Sydney)'}, 
                { key: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)'}, 
                { key: 'ca-central-1', name: 'Canada (Central)'}, 
                { key: 'ca-west-1', name: 'Canada West (Calgary)'}, 
                { key: 'eu-central-1', name: 'Europe (Frankfurt)'}, 
                { key: 'eu-west-1', name: 'Europe (Ireland)'}, 
                { key: 'eu-west-2', name: 'Europe (London)'}, 
                { key: 'eu-south-1', name: 'Europe (Milan)'}, 
                { key: 'eu-west-3', name: 'Europe (Paris)'}, 
                { key: 'eu-south-2', name: 'Europe (Spain)'}, 
                { key: 'eu-north-1', name: 'Europe (Stockholm)'}, 
                { key: 'eu-central-2', name: 'Europe (Zurich)'}, 
                { key: 'il-central-1', name: 'Israel (Tel Aviv)'}, 
                { key: 'me-south-1', name: 'Middle East (Bahrain)'}, 
                { key: 'me-central-1', name: 'Middle East (UAE)'}, 
                { key: 'sa-east-1', name: 'South America (São Paulo)'}, 
                { key: 'us-gov-east-1', name: 'AWS GovCloud (US-East)'}, 
                { key: 'us-gov-west-1', name: 'AWS GovCloud (US-West)'},
            ];
     
           fillListOfRegions(regions);
