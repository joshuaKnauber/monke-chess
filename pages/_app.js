import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {

  return <>
    <Head>
      <meta
        property="og:title"
        content="Monkey Chess"
      />
      <meta
        property="og:description"
        content="Better than normal chess because monke"
      />
      <meta property="og:image" content={`https://upload.wikimedia.org/wikipedia/commons/4/4e/Macaca_nigra_self-portrait_large.jpg`} />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
