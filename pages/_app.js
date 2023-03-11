import Layout from '@/components/Layout'
import "@fontsource/space-grotesk"

import { ChakraProvider } from '@chakra-ui/react'

import { extendTheme } from '@chakra-ui/react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

export const theme = extendTheme({
  fonts: {
    heading: `'Space Grotesk', sans-serif`,
    body: `'Space Grotesk', sans-serif`,
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false
  }
})

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default MyApp