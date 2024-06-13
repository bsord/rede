import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CenteredLayout } from '../../../components/Layouts';
import CreateSubscriptionForm from '../../subscription/components/CreateSubscriptionForm';
import logo from '../../../assets/logo.svg';
import { ReactTyped } from 'react-typed';

export const Landing = () => {
  const topRef = useRef(null);
  const scrollToTop = () => {
    topRef.current.scroll({
      top: 0,
      behavior: "smooth"
    });
  };

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

        {/* Big Selling Point Section */}
        <div className="w-full p-8 md:py-12 bg-gray-100">
          <div className="w-full max-w-3xl mx-auto text-center">
            <h2 className="text-4xl mb-6 font-bold text-gray-800 tracking-tight leading-none">Personalized AI Insights</h2>
            <p className="text-xl text-gray-500 leading-9">
              Get the latest updates and creative ideas tailored to your interests, all delivered straight to your inbox. Don't miss out on the information that matters most to you.
            </p>
          </div>
        </div>

        {/* Middle Sections */}
        <div className="py-12 w-full bg-white">
          {/* Middle Section 1 */}
          <div className="w-full p-8 md:py-12 ">
            <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center text-center md:text-left">
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzMwOXwwfDF8c2VhcmNofDJ8fGNvbnRlbnR8ZW58MHx8fHwxNjIwMDEwMzA2&ixlib=rb-1.2.1&q=80&w=1080"
                alt="Curated Content"
                className="w-full h-64 object-cover mb-4 md:mb-0 md:mr-12 md:w-1/2 rounded-xl"
              />
              <div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800 tracking-tight leading-none">Curated Content</h3>
                <p className="text-xl text-gray-500 leading-9">
                  Our AI-powered system curates content from reliable sources to bring you the best and most relevant information.
                </p>
              </div>
            </div>
          </div>

          {/* Middle Section 2 */}
          <div className="w-full p-8 md:py-12 ">
            <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center text-center md:text-left">
              <div className="order-2 md:order-1 md:mr-12 md:w-1/2">
                <h5 className="text-3xl font-bold mb-4 text-gray-800 tracking-tight leading-none">Personalized Experience</h5>
                <p className="text-xl text-gray-500 leading-9">
                  Customize your subscription preferences to get updates on the topics you are passionate about, delivered straight to your inbox.
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzMwOXwwfDF8c2VhcmNofDJ8fGNvbnRlbnR8ZW58MHx8fHwxNjIwMDEwMzA2&ixlib=rb-1.2.1&q=80&w=1080"
                alt="Personalized Experience"
                className="w-full h-64 object-cover mb-4 md:mb-0 md:order-2 md:w-1/2 rounded-xl"
              />
            </div>
          </div>

          {/* Middle Section 3 */}
          <div className="w-full p-8 md:py-12 ">
            <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center text-center md:text-left">
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzMwOXwwfDF8c2VhcmNofDJ8fGNvbnRlbnR8ZW58MHx8fHwxNjIwMDEwMzA2&ixlib=rb-1.2.1&q=80&w=1080"
                alt="Seamless Integration"
                className="w-full h-64 object-cover mb-4 md:mb-0 md:mr-12 md:w-1/2 rounded-xl"
              />
              <div>
                <h5 className="text-3xl font-bold mb-4 text-gray-800 tracking-tight leading-none">Seamless Integration</h5>
                <p className="text-xl text-gray-500 leading-9">
                  Our platform integrates smoothly with your daily routine, providing valuable insights without any hassle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="w-full bg-gray-100 p-8 md:py-12 ">
          <div className="w-full max-w-3xl mx-auto text-center">
            <h4 className="text-3xl font-bold text-gray-800 mb-4">Get Started Today</h4>
            <p className="text-xl text-gray-600 mb-6">Join the others who are already enjoying our personalized AI-powered insights. Sign up today and never miss an update!</p>
            <button onClick={scrollToTop} className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg text-lg font-semibold">TRY IT OUT</button>
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