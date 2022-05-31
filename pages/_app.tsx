// LIB TYPES
import type { AppProps } from 'next/app';
// LIB FUNCTIONS
import createCache from '@emotion/cache';
import nProgress from 'nprogress';
// LIB COMPONENTS
import { CacheProvider } from '@emotion/react';
import Router from 'next/router';
import Head from 'next/head';
// STYLES
import 'src/styles/index.scss';

// NPROGRESS
Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

export default function MyApp(props: AppProps) {
    const { Component, pageProps } = props;

    return (
        <CacheProvider value={createCache({ key: 'css' })}>
            <Head>
                <title>Basic Calculus Courseware</title>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <meta
                    name="google-site-verification"
                    content="WIIBnrMrrRueMV6KMO9esGZ7QNm3R_S6d-vktx7E4fY"
                />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/images/logo.png"></link>
                <meta
                    name="description"
                    content="A highly interactive web application courseware specifically made for basic calculus course."
                />
                <link rel="shortcut icon" href="/images/logo.png" type="image/png" />
            </Head>

            <Component {...pageProps} />
        </CacheProvider>
    );
}
