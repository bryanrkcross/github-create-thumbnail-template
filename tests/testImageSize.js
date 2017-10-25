// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var gm = require('gm')
            .subClass({ imageMagick: true }); // Enable ImageMagick integration.
var util = require('util');

// constants
var MAX_WIDTH  = 500;
var MAX_HEIGHT = 500;

// get reference to S3 client
var s3 = new AWS.S3();

 // Read options from the event.
 var srcBucket = "affraelambdapicsresized";
 // Object key may have spaces or unicode non-ASCII characters.
 var srcKey    = "resized-Octocat AWS Jetpack.jpg"

 console.log("srcBucket: ", srcBucket,"\n");
 console.log("srcKey: ", srcKey,"\n");

 // Infer the image type.
 var typeMatch = srcKey.match(/\.([^.]*)$/);
 if (!typeMatch) {
     console.log("Could not determine the image type.");
     return;
 }
 var imageType = typeMatch[1];
 if (imageType != "jpg" && imageType != "png") {
     console.log('Unsupported image type: ${imageType}');
     return;
 }

 // Download the image from S3, transform, and upload to a different S3 bucket.
 async.waterfall([
     function download(next) {
         // Download the image from S3 into a buffer.
         s3.getObject({
                 Bucket: srcBucket,
                 Key: srcKey
             },
             next);
         },
     function testSize(response, next) {
         gm(response.Body).size(function(err, size) {
             // Infer the scaling factor to avoid stretching the image unnaturally.

             console.log("size.width: ", size.width, " MAX_WIDTH: ", MAX_WIDTH);
             console.log("size.height: ", size.height,  " MAX_HEIGHT: ", MAX_HEIGHT);

             // Transform the image buffer in memory.
             var err ="";
             if(size.width > MAX_WIDTH) {
                err += "\nSize Problem - too wide";
             }

             if(size.height > MAX_HEIGHT) {
                err += "\nSize Problem - too tall";
             }

             if (err !="") {
                next(err);
             }
             else next(null);
         });
     }
     ], function (err) {
        var returnValue;
            if (err) {
               msg = 'Unsuccessfully tested size of ' + srcBucket + '/' + srcKey +
               ' due to an error: ' + err;
               returnValue=1;
            } else {
               msg = 'Successfully tested size of ' + srcBucket + '/' + srcKey;
               returnValue=0;
            }
         console.log(msg);
         process.exit(returnValue);
      }
   );
