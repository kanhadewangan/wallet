'use client'

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { theme } from './theme'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

const cache = createCache({ key: 'css' })

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={cache}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
} 