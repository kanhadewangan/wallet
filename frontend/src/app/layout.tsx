"use client"

import { Box, Flex, Button, Stack, useColorMode, useColorModeValue, IconButton, Container, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Inter } from 'next/font/google'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

const MotionBox = motion(Box)

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname()
  const isActive = pathname === href
  const activeColor = useColorModeValue('blue.500', 'blue.200')
  const inactiveColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Link href={href} passHref>
      <Text
        as="span"
        color={isActive ? activeColor : inactiveColor}
        fontWeight={isActive ? 'bold' : 'medium'}
        position="relative"
        _hover={{ color: activeColor }}
        transition="all 0.2s"
        cursor="pointer"
      >
        {children}
        {isActive && (
          <MotionBox
            position="absolute"
            bottom="-2px"
            left="0"
            right="0"
            height="2px"
            bg={activeColor}
            layoutId="navbar-indicator"
          />
        )}
      </Text>
    </Link>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { colorMode, toggleColorMode } = useColorMode()
  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            <Box
              as="nav"
              position="fixed"
              w="100%"
              bg={bgColor}
              borderBottom="1px"
              borderColor={borderColor}
              zIndex="sticky"
              backdropFilter="blur(10px)"
            >
              <Container maxW="container.xl">
                <Flex h={16} alignItems="center" justifyContent="space-between">
                  <Link href="/" passHref>
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      bgGradient="linear(to-r, blue.400, purple.500)"
                      bgClip="text"
                      cursor="pointer"
                    >
                      Your App
                    </Text>
                  </Link>

                  <Stack direction="row" spacing={8} alignItems="center">
                    <Stack direction="row" spacing={6}>
                      <NavLink href="/users">Users</NavLink>
                      <NavLink href="/posts">Posts</NavLink>
                      <NavLink href="/payments">Payments</NavLink>
                      <NavLink href="/transactions">Transactions</NavLink>
                    </Stack>

                    <Stack direction="row" spacing={4}>
                      <IconButton
                        aria-label="Toggle color mode"
                        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        onClick={toggleColorMode}
                        variant="ghost"
                      />
                      <Link href="/auth/signin" passHref>
                        <Button
                          colorScheme="blue"
                          variant="solid"
                          size="sm"
                          _hover={{ transform: 'translateY(-2px)' }}
                          transition="all 0.2s"
                        >
                          Sign In
                        </Button>
                      </Link>
                    </Stack>
                  </Stack>
                </Flex>
              </Container>
            </Box>

            <Box pt={16}>
              {children}
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  )
} 