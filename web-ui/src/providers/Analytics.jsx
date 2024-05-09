import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

export const Analytics = ({ children }) => {

  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search});
    // Send a custom event

    /* ReactGA.event({
      category: "your category",
      action: "your action",
      label: "your label", // optional
      value: 99, // optional, must be a number
      nonInteraction: true, // optional, true/false
      transport: "xhr", // optional, beacon/xhr/image
    }); */

  }, [location]);

  return children
}
