import React, { useState, useRef, useEffect } from 'react';

export const Select = ({ children, name, value, onChange, className, placeholder, ...rest }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);  // Track whether the component is focused
    const [selectedValue, setSelectedValue] = useState(value);
    const dropdownRef = useRef(null);
    const toggleRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsFocused(false); // Remove focus when clicking outside
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            const firstOption = dropdownRef.current.querySelector("li");
            if (firstOption) firstOption.focus();
        }
    }, [isOpen]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setIsFocused(true);  // Set focus state when toggling
    };

    const handleOptionClick = (optionValue) => {
        setSelectedValue(optionValue);
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            setIsOpen(false);
            setIsFocused(false);
            if (toggleRef.current) {
                toggleRef.current.blur();
            }
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        if (!isOpen) {
            setIsFocused(false);
        }
    };

    const renderOptions = () => {
        return React.Children.map(children, child => {
            if (child.type === "option") {
                return (
                    <li key={child.props.value}
                        tabIndex={0}
                        role="option"
                        aria-selected={child.props.value === selectedValue}
                        onClick={() => handleOptionClick(child.props.value)}
                        onKeyDown={handleKeyDown}
                        className={`cursor-pointer text-sm px-3 py-2 hover:bg-gray-50 focus:bg-gray-100 focus:outline-none text-blue-gray-700 ${className}`}>
                        {child.props.children}
                    </li>
                );
            }
            return null;
        });
    };

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef} {...rest}>
            <div ref={toggleRef}
                 role="button"
                 aria-haspopup="listbox"
                 aria-expanded={isOpen}
                 tabIndex={0}
                 onFocus={handleFocus}
                 onBlur={handleBlur}
                 className={`select-display bg-transparent text-blue-gray-700 outline-none transition-all border rounded-md px-3 py-3 h-full w-full cursor-pointer flex items-center justify-between ${isFocused ? 'border-sky-500 ring-2 ring-sky-200' : 'border-gray-200'}`}
                 onClick={toggleDropdown}
                 onKeyDown={handleKeyDown}>
                <span>{children.find(child => child.props.value === selectedValue)?.props.children || placeholder || "Select an option"}</span>
                <svg className={`w-6 h-6 transition-transform transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
            {isOpen && (
                <ul className="absolute z-50 w-full border border-blue-gray-200 bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
                    role="listbox"
                    aria-activedescendant={selectedValue}>
                    {renderOptions()}
                </ul>
            )}
        </div>
    );
};

export default Select;