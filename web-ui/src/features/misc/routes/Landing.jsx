import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CenteredLayout } from '../../../components/Layouts';
import CreateSubscriptionForm from '../../subscription/components/CreateSubscriptionForm';
import logo from '../../../assets/logo.svg';
import { ReactTyped } from 'react-typed';

export const Landing = () => {
  const topRef = useRef(null);

  const roles = [
    'Product Managers',
    'Designers',
    'Software Engineers',
    'Marketers',
    'Sales Professionals',
    'Educators',
  ];

  return (
    <CenteredLayout title="Welcome">
      <div className="w-full flex flex-col items-center justify-center" ref={topRef}>
        {/* Hero Section */}
        <div className="w-full p-4 py-16 md:p-8 md:py-16 bg-zinc-50">
          <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left ">
            <div className="md:w-1/2 mb-8 md:mb-0 text-black">
              {/* <h4 className="text-5xl font-bold tracking-tight leading-none mb-4">Personalized AI News <span className="text-amber-500">summarized to your inbox.</span></h4>
              <p className="max-w-3xl mb-6 font-light text-xl lg:mb-8 md:text-lg lg:text-xl leading-relaxed">
                Nothing quite like staying up to date with the latest AI news quickly.
              </p> */}
              <h1 className="text-4xl font-bold mb-4">
                Personalized AI News for<p className="text-4xl font-bold mb-4 text-amber-500">
                  {' '}
                  <ReactTyped
                    strings={roles}
                    typeSpeed={50}
                    backSpeed={50}
                    loop
                  />
                </p>
              </h1>

              <p className="text-xl mb-6">
                Stay informed with AI-summarized news tailored to your profession.
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
              Powered with ❤️ by <Link to={"https://bsord.io"} className="underline" target="_blank">Brandon</Link> and <Link to={"https://rene.makr.io"} className="underline" target="_blank">René</Link>.
            </p>
            <div className="mt-4">
              &copy; {new Date().getFullYear()} <Link to={'/privacy'} className="text-black underline">Privacy</Link>
            </div>
            <p className="text-black">

            </p>
          </div>
        </footer>
      </div>
    </CenteredLayout>
  );
};