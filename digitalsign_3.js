//Copyright 2014 Poran Prakash(https://github.com/ppbntl19/). Provided under the MIT license. See LICENSE file for details

document.addEventListener("DOMContentLoaded", function() {
    "use strict";


   // Used by several handlers later
    var signature;
    
   //Keypair in json format generated on server side using ursa rsa key genrator
    var object_2 = {
      "public_key":{
        "kty":"RSA",
        "n":"o62MPW_432uABUKOJd0SSXttpHtKG9AVKjKZOw13Qx-ntBqPSXhiEmGKEV_cbelUReGPQQ8_EYN7LtM_ELbWKlc5oH6B982zwU_QjQoluCkx0RZz0BeOP4qkCiBpu-kpQnoUqHD2wRFuhJ950hBbYC8dyIGkfDoL_h5hYJeoZc8",
        "e":"AQAB"
        },
      "private_key":{
        "kty":"RSA",
        "n":"o62MPW_432uABUKOJd0SSXttpHtKG9AVKjKZOw13Qx-ntBqPSXhiEmGKEV_cbelUReGPQQ8_EYN7LtM_ELbWKlc5oH6B982zwU_QjQoluCkx0RZz0BeOP4qkCiBpu-kpQnoUqHD2wRFuhJ950hBbYC8dyIGkfDoL_h5hYJeoZc8",
        "e":"AQAB",
        "d":"Ofd6lT-UmjuOKU663PoAQfnuiLQJOPRmqn0k-173f9Q0JnrJiDGUOgJFTYXvoRVjfSQ3AcmOgntYIus5iIfYLLGb5uHILZ7P9NOc-pVzJ6qWHLU0DMr6hAb2492XZPODT6WNSm1-Uh85RC_gceju4VVLd8aOe6tz5RTpvU1V57E",
        "p":"ztAeJzKlCX6JDPMiX4blXm50kTfPSgPNwZ239l7kDoD-ZB1M7Cx2HSVwMyLLG8ZKajApMkan9s3s7yRySg-ljQ",
        "q":"ypsjM70Cb-EWx5lLfeL_M1l2NIhUMsd-c_9XTHw-r3CehSK0XZURS7xkHIWY12k6V4bKlyUn6a-URmQxv8Nbyw",
        "dp":"XIo5g9agjIAHOTkt_0qwJbINDNHJOlg7YFB_eYl6SJclvYxy2BcI_v-6ldcSxSnUMHG-bVW6YLBCPbu0PDmGHQ",
        "dq":"qEQSB105ketx_NFeti15X480McrrisTOS85MFZS2hwRUUyQQggxUsf7DckCuQHD_aEPlK4RLUrRkw9Vgz--S4w",
        "qi":"b74z6dgY7Bjru2sKQJWVHxwH12OM9TWmCxVmWKv017n_D82HMwfjBKJ99aOyHKQiTmj37DzgmAvWnUvzhsAiAw"
      },
      "__v":0,
      "status":true,
      "created_at":"2016-12-16T16:08:58.437Z"
    };
    // Only enable the cryptographic operation buttons if a key pair can be created
    document.getElementById("sign").addEventListener("click", signTheFile);
    document.getElementById("verify").addEventListener("click", verifyTheSignature);
   

    // Click handlers to sign or verify the given file:
    function signTheFile() {
      var plaintext = document.querySelector('.output').value
        // initialize
        var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
        // initialize for signature generation
        sig.init(object_2.private_key);   // rsaPrivateKey of RSAKey object
        // update data
        sig.updateString(plaintext)
        // calculate signature
        signature = sig.sign()
        alert("signature signed.If you will make any changes in given signature  it will become invalid");
    } // end of signTheFile click handler




    function verifyTheSignature() {
      var plaintext = document.querySelector('.output').value
      // initialize
      var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
      // initialize for signature validation
      sig.init(object_2.public_key); // signer's certificate
      // update data
      sig.updateString(plaintext)
      // verify signature
      var isValid = sig.verify(signature)
      console.log(isValid,signature)
      if (isValid) {
        alert('Wow It works!!! Signature is valid');
      }
      else {
        alert('Something went wrong.... Invalid  Signature');
      } 
    } // end of decryptTheFile

});
