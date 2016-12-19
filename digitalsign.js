//Copyright 2014 Poran Prakash(https://github.com/ppbntl19/). Provided under the MIT license. See LICENSE file for details

document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    // Fix Apple prefix if needed
    if (window.crypto && !window.crypto.subtle && window.crypto.webkitSubtle) {
        window.crypto.subtle = window.crypto.webkitSubtle;  // Won't work if subtle already exists
    }

    if (!window.crypto || !window.crypto.subtle) {
        alert("Your current browser does not support the Web Cryptography API! This page will not work.");
        return;
    }

    var keyPair = {};    // Used by several handlers later
    var signature;
    var plaintext_buffer;
    
    //Keypair in json format generated on server side using ursa rsa key genrator
    var object = {
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

    
    importprivateKeyAndSaveAKeyPair().
    then(function() {
        // Only enable the cryptographic operation buttons if a key pair can be created
        document.getElementById("sign").addEventListener("click", signTheFile);
    }).
    catch(function(err) {
        alert("Could not create a keyPair or enable buttons: " + err.message + "\n" + err.stack);
    });

    importpublicKeyAndSaveAKeyPair().
    then(function() {
        // Only enable the cryptographic operation buttons if a key pair can be created
        document.getElementById("verify").addEventListener("click", verifyTheSignature);
    }).
    catch(function(err) {
        alert("Could not create a keyPair or enable buttons: " + err.message + "\n" + err.stack);
    });

    // Key pair creation:

    function importprivateKeyAndSaveAKeyPair() {
      //Import private key
      return window.crypto.subtle.importKey(
          "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
          object.private_key,
          {   //these are the algorithm options
              name: "RSASSA-PKCS1-v1_5",
              hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
          },
          false, //whether the key is extractable (i.e. can be used in exportKey)
          ["sign"] //"verify" for public key import, "sign" for private key imports
      )
      .then(function(privateKey){
          //returns a publicKey (or privateKey if you are importing a private key)
           keyPair.privateKey = privateKey;
      })
      .catch(function(err){
          console.error(err);
      });
    }
    
    function importpublicKeyAndSaveAKeyPair() {
      //Import public key
      return window.crypto.subtle.importKey(
            "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
           object.public_key,
            {   //these are the algorithm options
                name: "RSASSA-PKCS1-v1_5",
                hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            },
            false, //whether the key is extractable (i.e. can be used in exportKey)
            ["verify"] //"verify" for public key import, "sign" for private key imports
        )
        .then(function(publicKey){
            //returns a publicKey (or privateKey if you are importing a private key)
             keyPair.publicKey = publicKey;
        })
        .catch(function(err){
            console.error(err);
        });
    }



    // Click handlers to sign or verify the given file:
    function signTheFile() {
        var plaintext = document.querySelector('.output').value
        //Convert text in to array buffer
        var enc = new TextEncoder("utf-8");
        plaintext_buffer = enc.encode(plaintext);

        processTheSignature()
        // Asynchronous handler:
        function processTheSignature() {
      
            sign(plaintext, keyPair.privateKey).
            then(function(hash) {
              alert("signature signed.If you will make any changes in given signature  it will become invalid");
              signature = hash;
              return hash;
            }).
            catch(function(err) {
                alert("Something went wrong signing: " + err.message + "\n" + err.stack);
            });


            function sign(plaintext, privateKey) {
              return  window.crypto.subtle.sign(
                  {
                      name: "RSASSA-PKCS1-v1_5",
                  },
                  privateKey, //from generateKey or importKey above
                  plaintext_buffer //ArrayBuffer of data you want to sign
              )
              .then(function(signature){
                  //returns an ArrayBuffer containing the signature
                  return new Uint8Array(signature)
              })
              .catch(function(err){
                  console.error(err);
              });
            } // End of sign
        } // end of processTheFile
    } // end of signTheFile click handler




    function verifyTheSignature() {
      var plaintext = document.querySelector('.output').value
      //Convert text in to array buffer
      var enc = new TextEncoder("utf-8");
      plaintext_buffer = enc.encode(plaintext);
      //Change textand convert in to array buffer
        processTheSignature();
        function processTheSignature() {

            verify(plaintext_buffer, signature, keyPair.publicKey).
            then(function(isValid) {
                if (isValid === null) {
                    alert("Invalid signature!");
                } else {
                    alert("Signature is valid.");
                }
            }).
            catch(function(err) {
                alert("Something went wrong verifying: " + err.message + "\n" + err.stack);
            });


            function verify(plaintext, signature, publicKey) {
                // Shows an alert stating whether the signature is
                // valid or not, and returns a Promise the yields
                // either a Blob containing the original plaintext
                // or null if the signature was invalid.

                return window.crypto.subtle.verify(
                    {name: "RSASSA-PKCS1-v1_5"},
                    publicKey,
                    signature,
                    plaintext
                ).
                then(handleVerification);

                function handleVerification(successful) {
                    // Returns either a Blob containing the original plaintext
                    // (if verification was successful) or null (if not).
                    if (successful) {
                        return successful
                    } else {
                        return null;
                    }
                }

            } // end of verify
        } // end of processTheFile
    } // end of decryptTheFile

});
