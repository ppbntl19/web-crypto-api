//Copyright 2014 Poran Prakash(https://github.com/ppbntl19/). Provided under the MIT license. See LICENSE file for details

document.addEventListener("DOMContentLoaded", function() {
    "use strict";


   // Used by several handlers later
    var signature;
    
    //Keypair in json format generated on server side using ursa rsa key genrator
    var object = { __v: 0,
                  private_key: '-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQCwxeirORK5qdWw3RAVSNaDELC8O5AcRXsyFVlD+6aP3X31hZoq\n3AOAxByIJ9C36DvpW0IUaiKgQCjWlIYaXCIbMMuQcj9YsP9jPqfkaYnM/o34M3Pn\nYNP+KkwJenUpXfhV//c20ga9diXRTVhdLydGKUlpfpoTHjdIOuMBzhQcPwIDAQAB\nAoGBAKYwWa5niLgt9+0/1zf7c1hi35UHdlNt6wVJ1tM4Cf5k4F9rzGWQ1GZBeQV0\nUSAk3/ZiSjyBD66SwxIBLhYoGhLgDf2QFzugMIFKiEI3BmVT51rqJzFENNPPSJCx\nwrjSBhyjcKS83k1IiSwGyU7Op1hWZ+h7EJCUfTQ4IAw/NYIhAkEA1SVfk8oCGeSy\nJU0C2NkPBYpMsxeTshigvAdPxiFJo3Dg1NR/Xrm0cBsSCadnjEhfj8Y83qvNCpOB\nF6IIcvALMQJBANRQa+cEuBKEyoGq1hE1lU6Kn7/BtvOM27y0UdIQIQIk+VGwOcoi\nqppG4B9ANCXZ7FSUmci9m6s3z/DS6Ex+4m8CQGaGh6brMH+MBjTzCj+MiTE9CQ/M\nc3rjZc2MJs9DC8zWaw9095907FpQayjBoYlU9sKNtJHXSdWghiP8CNxgosECQEVs\nvrveCSrVDTr1V+ZstRPntHEJsP9W0guUkySzbXe8C2Kw01TLnSmxf1v4rJSr++F0\nbgz8I0kLiQ1gieFppDUCQHPW5JgjpL5egPhtAtqvkfcFsXyBzClhB4OtDz7IM0/S\nAxRfvJEE4htLfM02XfA0IPL5s5NwfE2mlH695yojiUo=\n-----END RSA PRIVATE KEY-----\n',
                  public_key: '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwxeirORK5qdWw3RAVSNaDELC8\nO5AcRXsyFVlD+6aP3X31hZoq3AOAxByIJ9C36DvpW0IUaiKgQCjWlIYaXCIbMMuQ\ncj9YsP9jPqfkaYnM/o34M3PnYNP+KkwJenUpXfhV//c20ga9diXRTVhdLydGKUlp\nfpoTHjdIOuMBzhQcPwIDAQAB\n-----END PUBLIC KEY-----\n',
                  organisaton: '00D2800000119GtEAI',
                  user_id: '58649e2db944646e29f5cc04',
                  status: true,
                 }


    // Only enable the cryptographic operation buttons if a key pair can be created
    document.getElementById("sign").addEventListener("click", signTheFile);
    document.getElementById("verify").addEventListener("click", verifyTheSignature);
   

    // Click handlers to sign or verify the given file:
    function signTheFile() {
      var plaintext = document.querySelector('.output').value

      // Encrypt with the public key...
      var encrypt = new JSEncrypt( 1024 );
      encrypt.setPublicKey(object.public_key);
      signature = encrypt.encrypt(plaintext);
      alert("signature signed.If you will make any changes in given signature  it will become invalid");
    } // end of signTheFile click handler




    function verifyTheSignature() {
      var plaintext = document.querySelector('.output').value
      // Decrypt with the private key...
      var decrypt = new JSEncrypt(1024 );
      decrypt.setPrivateKey(object.private_key);
      var uncrypted = decrypt.decrypt(signature);
      console.log(signature,uncrypted,plaintext)
      // Now a simple check to see if the round-trip worked.
      if (uncrypted == plaintext) {
        alert('It works!!! Signature valid');
      }
      else {
        alert('Something went wrong.... Invalid  Signature');
      } 
    } // end of decryptTheFile

});
