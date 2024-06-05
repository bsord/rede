import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CenteredLayout } from '../../../components/Layouts';
import CreateSubscriptionForm from '../../subscription/components/CreateSubscriptionForm';
import logo from '../../../assets/logo.svg';

export const Landing = () => {
  const topRef = useRef(null);

  return (
    <CenteredLayout title="Welcome">
      <div className="w-full flex flex-col items-center justify-center" ref={topRef}>
        {/* Hero Section */}
        <div className="w-full p-4 py-16 md:p-8 md:py-16 bg-zinc-50">
          <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left ">
            <div className="md:w-1/2 mb-8 md:mb-0 text-black">
              <h4 className="text-5xl font-bold tracking-tight leading-none mb-4">AI News summarized <span className="text-amber-500">to your inbox.</span></h4>
              <p className="max-w-3xl mb-6 font-light text-xl lg:mb-8 md:text-lg lg:text-xl leading-relaxed">
                Nothing quite like staying up to date with the latest AI news quickly.
              </p>
            </div>
            <div className="md:w-2/5 w-full flex items-center justify-center">
              <CreateSubscriptionForm />
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="w-full p-8 md:py-12 bg-zinc-50">
          <div className="w-full max-w-5xl mx-auto text-center text-black">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="Logo" className="w-6 h-6 mr-2 rounded bg-amber-500" />
              <span className="text-xl font-semibold">Rede</span>
            </div>
            <p className="text-black">
              &copy; {new Date().getFullYear()} Floydbase LLC.
            </p>
            <p className="text-black">
              Powered with ❤️ by <Link to={"https://bsord.io"} className="underline" target="_blank">Brandon</Link> and <Link to={"https://rene.makr.io"} className="underline" target="_blank">René</Link>.
            </p>
            <div className="mt-4">
              <Link to={'/privacy'} className="text-black underline">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </CenteredLayout>
  );
};