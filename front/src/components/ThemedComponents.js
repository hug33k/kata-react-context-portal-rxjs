import React, { useContext, Children, cloneElement } from 'react';
import ThemeContext from '../contexts/ThemeContext';

const ThemesComponents = ({ children }) => {
    const { theme } = useContext(ThemeContext);

    const themedChildren = Children.toArray(children).map(child => cloneElement(child, { style: theme }));

    return (
        <>
            {themedChildren}
        </>
    );
}

export default ThemesComponents;
