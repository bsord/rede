import { Head } from '../../../components/Head';
import { Navbar } from '../../../components/Navbar';

export const Layout = ({ title, children }) => {
  return (
    <>
      <Head title={title} />
      <div className="flex flex-col items-center ">
        <div className='fixed top-0 z-50 w-full h-16'>
          <Navbar />
        </div>
        <main className="w-full mx-auto mt-16 ">{children}</main>
      </div>
    </>
  );
};
