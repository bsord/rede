import React, { forwardRef } from 'react';

export const Input = forwardRef(({ variant, className, children, ...rest }, ref) => {
  const variants = {
    default:
      'relative peer w-full h-full bg-transparent text-gray-700 font-sans outline outline-0 focus:outline-0 disabled:bg-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-gray-200 placeholder-shown:border-t-gray-200 border   text-xl px-3 py-6 rounded-md border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200    h-14',
  };

  let classes = variants[variant] ?? variants.default;
  classes = classes + ' ' + className;

  return (
    <div className="relative h-11">
      <input ref={ref} className={classes} {...rest} />
      {children}
    </div>
  );
});
