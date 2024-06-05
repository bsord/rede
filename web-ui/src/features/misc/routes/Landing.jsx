import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CenteredLayout } from '../../../components/Layouts';
import CreateSubscriptionForm from '../../subscription/components/CreateSubscriptionForm';
import logo from '../../../assets/logo.svg';

export const Landing = () => {
  const topRef = useRef(null);
  //TODO fix scrollToTop - not working
  const scrollToTop = () => {
    topRef.current.scroll({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <CenteredLayout title="Welcome">
      <div className="w-full flex flex-col items-center justify-center" ref={topRef}>
        {/* Hero Section */}
        <div className="w-full p-4 py-16 md:p-8 md:py-16 bg-amber-50 ">
          <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left ">
            <div className="md:w-1/2 mb-8 md:mb-0 text-black">
              <h4 className="text-5xl font-bold tracking-tight leading-none mb-4">AI messages <span className="text-amber-500">for your inbox.</span></h4>
              <p className="max-w-3xl mb-6 font-light text-xl lg:mb-8 md:text-lg lg:text-xl leading-relaxed">
                Nothing quite like staying up to date with the latest news or getting creative ideas for the topics you love most.
              </p>
            </div>
            <div className="md:w-2/5 w-full flex items-center justify-center">
              <CreateSubscriptionForm />
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="w-full p-8 md:py-12 bg-gray-900">
          <div className="w-full max-w-5xl mx-auto text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="Logo" className="w-6 h-6 mr-2 rounded bg-sky-600" />
              <span className="text-xl font-semibold">Rede</span>
            </div>
            <p className="text-gray-200">
              &copy; {new Date().getFullYear()} Floydbase LLC.
            </p>
            <p className="text-gray-200">
              Powered with ❤️ by Brandon and Rene.
            </p>
            <div className="mt-4">
              <Link to={'/privacy'} className="text-gray-300 underline">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </CenteredLayout>
  );
};