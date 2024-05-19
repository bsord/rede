import { Head } from '../../../components/Head';
import { Sidebar } from '../../../components/Sidebar';

import { Copyright } from '../../../components/Copyright';
import { Navbar } from '../../../components/Navbar';

export const Layout = ({ title, children }) => {
  return (
    <>
      <Head title={title} />
      <div className="h-dvh flex flex-col overflow-hidden bg-gray-100 bg-blue-gray-50 items-center">
        <Navbar />
        <div className="flex flex-col w-full overflow-hidden justify-between flex-grow ">
          

          <main className="flex-1 relative overflow-y-auto focus:outline-none bg-white ">{children}</main>

          <div className="p-2">
            <Copyright />
          </div>
        </div>
      </div>
    </>
  );
};
