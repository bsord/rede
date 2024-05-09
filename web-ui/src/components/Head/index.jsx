import { Helmet } from 'react-helmet-async'

export const Head = ({ title = '', description = '' }) => {
  const appName = 'Rede'
  return (
    <Helmet title={appName + ' | ' + title} defaultTitle="Rede">
      <meta name="description" content={description} />
    </Helmet>
  )
}
