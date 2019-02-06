const yargs = require('yargs')
  .command('electronjs-google-aws-saml-extractor', 'Get STS credentials for the AWS CLI')
  .demandOption('url', 'The IDP Initiated SSO URL to to open')
  .demandOption('credential-file', 'The location where the temporary credentials will be stored')
  .demandOption('principal-arn', 'The ARN of the principal. This identifies the IDP')
  .demandOption('role-arn', 'The ARN of the role to assume')
  .parse(process.argv.slice(1))

module.exports = { 
  url: yargs.url, 
  config_file: yargs["credential-file"] ,
  principal_arn: yargs["principal-arn"],
  role_arn: yargs["role-arn"]
}