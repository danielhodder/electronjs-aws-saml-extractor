# SSO Provider for the AWS CLI

AWS provides a mechinism to use your existing SAML Ideneity Provider to login to the AWS console. However, AWS provide no sane way to wire a service like Google's IDP into the AWS CLI.

To make the CLI work you usually need an Access Key and a Secret Key; which are attached to an IAM User. However, when using SSO you assume a role directly; never having a user at all. This means you're in a bit of a bind in terms of bootstrapping the system.

The main reason you would want to use a SAML IDP is becuase you already have a strong password, rotation policies, JML processes, and MFA setup.  However, since most providers I've seen connect back to the IDP _every, single time_. This means you end up being asked for MFA every time, and probably trigger login abnormality detection in your IDP.

This tool solves most of these problems. The reason you don't have this problem with most of the apps you normally use is twofold:

1. The application caches it's credentials until they're expired
1. They are web-apps and when they need a new credential, you probably still have a valid IDP session, so all that you observe is a redirect bounce to the IDP and back again and the applicaion just carries on as before.

When this application is opened it will try and read the credential in the provided file. If there aren't any, or they are expired, it will open an electron frame to the IDP and extract the SAML Response data. That it then passed to the STS Assume Role With SAML operation, and the resulting credentials are stored and returned backed to the calling process. Since the electron app stores cookies it will re-use your existing IDP login session so most of the time you should just see a blank page while all the redirect happen then, the window close and you getting on with your job. Nice and simple. Just as it should work.

## AWS Configuration

This tool required you to setup the `credential_process` option in the AWS CLI Profile configuration. An example configuration would look like:

```
[profile default]
region = us-west-2
credential_process = <path to provider>
```

There's more documentation on this feature, and some issues with it on AWS's documentation: https://docs.aws.amazon.com/cli/latest/topic/config-vars.html#sourcing-credentials-from-external-processes

## Building

I use NVM to get the current stable node (8.11.11 at the time of writing). 

To get all the dependencies run `npm install` in the root of the project.

To build the binary run `npm run package:linux` (only linux works right now, PR's are welcome for other OSs)

## Running

There are four options which are required to make the application work:

### Options

* `url` - The URL that should be opened to start the SAML flow, if you can include your IDP username so you don't have to click anything.
* `credential-file` - The path to the file which will contain your temporary credentials.
* `principal-arn` - The ARN of the SAML IDP. This is in the SAML Response data, so snag it there if your IT admin won't tell it to you.
* `role-arn` The ARN of the role to assume. Again this will be in the SAML Response if you don't know it

### Google Apps example

The best way to get the Google apps start URL is to click the launch button in the google app launcher. Look out for something pointing at https://accounts.google.com/AccountChooser. To auto-select your user add `&Email=<user>@<domain>` to the end

## Developing

There's a VS code launch target which allows you to debug the main process. If, for some reason, you want to debug the electron shell there's a `debug` const in `browser.js` which can be set to true to enable dev tools.