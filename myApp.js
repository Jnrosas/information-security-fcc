const express = require('express');
const app = express();
const helmet = require('helmet');

// to avoid hackers to know that the page is powered by express
app.use(helmet.hidePoweredBy('X-Powered-By: Express'));

// to avoid anyone to put our page into an iframe or frame
app.use(helmet.frameguard({action: 'deny'}));

// to avoid the XSS attacks, we can use helmet.xssFilter().Sanitizing means 
// that you should find and encode the characters that may be dangerous to your application.
app.use(helmet.xssFilter());

// to avoid the browser to open any untrusted HTML, we can use helmet.noSniff().
// Browsers can use content or MIME sniffing to override the Content-Type header of a response to guess and process the data using an implicit content type. While this can be convenient in some scenarios, it can also lead to some dangerous attacks. This middleware sets the X-Content-Type-Options header to nosniff, instructing the browser to not bypass the provided Content-Type.
app.use(helmet.noSniff());

// to prevent IE users from executing downloads in the trusted site’s context.
// This middleware sets the X-Download-Options header to noopen. This will prevent IE users from executing downloads.
app.use(helmet.ieNoOpen());

// to force users to use HTTPS for future requests, we can use helmet.hsts(). it needs to own a domain and SSL/TLS certificate first
ninetyDaysInSeconds = 90*24*60*60;
app.use(helmet.hsts({maxAge: ninetyDaysInSeconds, force: true}));

// to avoid pre fetching DNS, we can use helmet.dnsPrefetchControl(). 
app.use(helmet.dnsPrefetchControl());

// to avoid client-side storing cache, we can use helmet.noCache(). Allows clients to download always the latest version of the file.
app.use(helmet.noCache());

// Set a Content Security Policy. It sets a default Content Security Policy.
// It takes a directives object, which tells the browser what to do with trusted sources you've specified.
// The trusted sources are directly provided by the developer, trusted by your app, and should be specified as direct.
// The directives object is a key-value pair, where the key is the directive name, and the value is an array of trusted sources you want to use for that directive.
// The trusted sources are either a domain name, or a direct URL.
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'trusted-cdn.com']
  }
}));

// Configure parent helmet(). This middleware sets some common directives: All of the above, except noCache() and contentSecurityPolicy().
// - It enforces the RFC-7234 medium-range rendering-intensive Content-Type options:
//   - noSniff 
//   - ieNoOpen
// - Prevents IE users from executing downloads in the trusted site’s context.
// - Sets the X-Download-Options header to noopen. This will prevent IE users from executing downloads.
// - Sets the X-Content-Type-Options header to nosniff, instructing the browser to not bypass the provided Content-Type.
// - Prevents the browser from accessing your site via un-encrypted requests.
// - Sets the Strict-Transport-Security header to tell browsers to prefer HTTPS to HTTP.
// - Sets the X-Permitted-Cross-Domain-Policies header to none. IE users cannot currently be sent 
app.use(helmet());


module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
