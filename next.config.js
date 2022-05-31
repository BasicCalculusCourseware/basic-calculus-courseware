/** @type {import('next').NextConfig} */

const intercept = require('intercept-stdout');
intercept((text) => (text.includes('Duplicate atom key') ? '' : text));

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['lh3.googleusercontent.com', 'localhost'],
    },
};

module.exports = nextConfig;
