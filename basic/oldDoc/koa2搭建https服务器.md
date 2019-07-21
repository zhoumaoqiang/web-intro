搭建https服务器，踩了许多坑，尝试过使用java jdk的keytool创建证书转换，还有使用xca转换证书，基于tomcat服务器构建成https，最终还是采用openssl创建证书并导入koa2的服务器最简单方便和可行。
https是基于ssl的http协议，安全证书就是由于是本地开发，所以采用自签名的证书，这就需要openssl生成。
1. 安装openssl，在官网是找不到windows系统openssl的安装包的，但是可以再git上找到它的源码。下载地址：http://slproweb.com/products/Win32OpenSSL.html
2. 找到合适的版本下载安装，添加安装文件bin目录的路径至环境变量的path，然后可以通过命令行打开```openssl -version```查看指令是否有效
环境配置完成，那么接下来就要生成证书，主要分为CA、服务端、客户端的证书，对于服务器开启https只需要CA和服务端即可，通过管理员身份打开控制台并输入以下指令。
1. 创建自己的CA机构
    - 为CA生成私钥: ```openssl genrsa -out ca-key.pem -des 1024```
    - 通过CA私钥生成CSR: ```openssl req -new -key ca-key.pem -out ca-csr.pem```
    - 通过CSR文件和私钥生成CA证书(注意x509格式): ```openssl x509 -req -in ca-csr.pem -signkey ca-key.pem -out ca-cert.pem```
    - 密码和信息自定义即可，完成后在命令行对应路径下应该有上面对应的3个.pem文件
2. 创建服务端证书（生成文件需导入koa2中，以开启https服务）
    - 为服务器生成私钥: ```openssl genrsa -out server-key.pem 1024```
    - 利用服务器私钥文件服务器生成CSR: ```openssl req -new -key server-key.pem -config openssl.cnf -out server-csr.pem```
    - 通过服务器私钥文件和CSR文件生成服务器证书: ```openssl x509 -req -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -in server-csr.pem -out server-cert.pem -extensions v3_req -extfile openssl.cnf```
    - 同样完成后应当得到三个.pem文件，执行前将openssl.cnf放到命令行对应目录下，没有的话可参考下方代码
        ```
          [req]  
          distinguished_name = req_distinguished_name  
          req_extensions = v3_req  
        
          [req_distinguished_name]  
          countryName = Country Name (2 letter code)  
          countryName_default = CN  
          stateOrProvinceName = State or Province Name (full name)  
          stateOrProvinceName_default = BeiJing  
          localityName = Locality Name (eg, city)  
          localityName_default = YaYunCun  
          organizationalUnitName  = Organizational Unit Name (eg, section)  
          organizationalUnitName_default  = Domain Control Validated  
          commonName = Internet Widgits Ltd  
          commonName_max  = 64  
        
          [ v3_req ]  
          # Extensions to add to a certificate request  
          basicConstraints = CA:FALSE  
          keyUsage = nonRepudiation, digitalSignature, keyEncipherment  
          subjectAltName = @alt_names  
        
          [alt_names]  
          IP.1 = 127.0.0.1
        ```
3. 创建客户端证书
    - 生成客户端私钥: ```openssl genrsa -out client-key.pem```
    - 利用私钥生成CSR: ```openssl req -new -key client-key.pem -out client-csr.pem```
    - 生成客户端证书: ```openssl x509 -req -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -in client-csr.pem -out client-cert.pem```
由于采用koa2框架，框架bin目录中www为启动配置，需更改开启服务的代码，替换成
    ```
    // 替换原http对象为https对象，引入filesystem对象读取证书
    const https = require('https');
    const fs = require('fs');

    let options = {
      key: fs.readFileSync('./keys/server-key.pem'),
      ca: [fs.readFileSync('./keys/ca-cert.pem')],
      cert: fs.readFileSync('./keys/server-cert.pem')
    };
    // 将原本开启服务的代码注释更换为以下部分，根据需求监听端口
    https.createServer(options,function(req,res){
      res.writeHead(200);
      res.end(app.callback());
    }).listen(3000,'127.0.0.1');
    ```
启动koa2，在浏览器中通过https请求服务，选择网页继续访问即可，由于自签名证书不是由可信任机构颁布，所以浏览器会默认阻止，继续访问即可