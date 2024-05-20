import { Head } from '../Head'
import Navbar from '../Navbar'
export const CenteredLayout = ({ children, title }) => {
  return (
    <>
      <Head title={title} />
      <div className="h-dvh flex flex-col items-center bg-gray-100 ">
        <div className='fixed top-0 z-50 w-full h-16'>
          <Navbar />
        </div>
        <main className="w-full mx-auto mt-16 h-full">{children}</main>
      </div>
    </>
  )
}
