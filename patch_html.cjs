const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const headEnd = content.indexOf('</head>');
const metaTags = `
    <title>EduCore</title>
    <meta name="description" content="AI-powered learning, study, practice and trivia platform.">
    <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
    <link rel="apple-touch-icon" href="/pwa-192x192.svg" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
`;

content = content.replace('<title>My Google AI Studio App</title>', metaTags);

fs.writeFileSync('index.html', content);
console.log('patched index.html');
