import { Head } from '../../../components/Head';
import { Sidebar } from '../../../components/Sidebar';

import { Copyright } from '../../../components/Copyright';
import { Navbar } from '../../../components/Navbar';

export const Layout = ({ title, children }) => {
  return (
    <>
      <Head title={title} />
      <div className="flex flex-col items-center overflow-x-hidden">
        <div className='fixed top-0 z-50 w-full h-16'>
          <Navbar />
        </div>
        <main className="w-full mx-auto mt-16">{children}</main>
      </div>
    </>
  );
};
