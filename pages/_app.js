// import App from 'next/app'

import '../styles/main.scss'
import { wrapper } from '../store/store';
import App, { Container } from 'next/app'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper';
import Head from 'next/head'
import "simplemde/dist/simplemde.min.css";
import 'highlight.js/styles/github.css';
import 'react-calendar-heatmap/dist/styles.css';

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.

// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    return {
      pageProps: Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}
    }
  }

  render() {
    const { Component, pageProps, store } = this.props
    return (
      <>
        <Head>
          <link rel="stylesheet" type="text/css" href="https://rsms.me/inter/inter-ui.css" /> 
          <link rel="stylesheet" type="text/css" href={`../static/css/antd.min.css`}></link>
          <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossOrigin="anonymous"></script>
          <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossOrigin="anonymous"></link>
          <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossOrigin="anonymous"></script>
          <link rel="stylesheet" href="../static/iconfont/iconfont.css"></link>
          <title>Code Trainee</title>
        </Head>
        <Component {...pageProps} />
      </>
    )
  }
}

export default wrapper.withRedux(MyApp)
