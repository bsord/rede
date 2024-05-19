import { Head } from '../Head'
import Navbar from '../Navbar'
export const CenteredLayout = ({ children, title }) => {
  return (
    <>
      <Head title={title} />
      <div className="h-dvh flex flex-col items-center bg-gray-100">
        <Navbar />
        <div className="flex flex-col w-full overflow-hidden justify-between flex-grow">
          

          <main className="flex-1 relative overflow-y-auto focus:outline-none">{children}</main>

          
        </div>
      </div>
    </>
  )
}
