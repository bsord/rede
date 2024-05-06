import { Helmet } from 'react-helmet-async'

export const Head = ({ title = '', description = '' }) => {
  const appName = 'App Name'
  return (
    <Helmet title={appName + ' | ' + title} defaultTitle="App Name">
      <meta name="description" content={description} />
    </Helmet>
  )
}
