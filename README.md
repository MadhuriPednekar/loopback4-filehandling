This application helps to understand how to accept multipart/form-data when creating rest services using lb4. It also sheds light on datasource configuration required to pass form data when calling external rest api's

## Steps to run this simple application
1. Clone the application : `git clone https://github.com/MadhuriPednekar/loopback4-filehandling.git`
2. Execute `npm start` command

- `http://localhost:3000/file/upload` : this API accepts file as an input and provides file content as output
    
- `http://localhost:3000/file/upload/externalApi` : this API accepts file as an input; uploads the file to another rest api and returns the response
