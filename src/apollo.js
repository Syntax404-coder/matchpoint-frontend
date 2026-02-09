import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createUploadLink({
  uri: import.meta.env.VITE_API_URL || 'http://localhost:3000/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    }
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})