import { useEffect, useRef } from 'react';

const ContentPreview = ({ htmlContent }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const document = iframe.contentDocument || iframe.contentWindow.document;
    
    document.open();
    document.write(htmlContent);
    document.close();
  }, [htmlContent]); // This effect runs every time htmlContent changes.

  return (
    <iframe ref={iframeRef} className='w-full h-[30em] bg-white' />
  );
}

export default ContentPreview
