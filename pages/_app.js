import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {

  return <>
    <Head>
      <title>Monke Chess</title>
      <meta
        property="og:title"
        content="Monkey Chess"
      />
      <meta
        property="og:description"
        content="Better than normal chess because monke"
      />
      <meta property="og:image" content={`https://api.time.com/wp-content/uploads/2015/09/monkey-selfie.jpg`} />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
