import React, { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';
import Select from './Select';

const ThemeSelector = () => {
    const { themes, selectTheme } = useContext(ThemeContext);

    const handleSelect = (e) => {
        selectTheme(e.target.value);
    };

    return (
        <Select values={Object.keys(themes)} onSelect={handleSelect} />
    );
}

export default ThemeSelector;
