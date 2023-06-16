import React, { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';

const Button = ({ children }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <button style={theme}>{children}</button>
    );
};

export default Button;
