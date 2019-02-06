const { role_arn, principal_arn } = require('./options')
const STS = require('aws-sdk/clients/sts');
const config = require('./config')

/**
 * Aquire the object which has all the data needed for a credential provider.
 * 
 * @param {string} samlResponse Base64 encoded SAML Response.
 */
function aquireShortLivedCredentials(samlResponse) {
  return new STS().assumeRoleWithSAML({
    // TODO get the principal from the SAML response
    PrincipalArn: principal_arn, 
    // TODO get the role from the SAML response if there's just one
    RoleArn: role_arn,
    SAMLAssertion: samlResponse
  }).promise().then(saveAndReturn);
}

function saveAndReturn(stsResponse) {
  const fileFormat = { ...stsResponse.Credentials, Version: 1 }
  return config.saveCredentials(fileFormat).then(() => fileFormat);
}

module.exports = { aquireShortLivedCredentials }