import React, { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';

const Select = ({ values, onSelect }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <select style={theme} onChange={onSelect}>
            {values.map((value, index) => (
                <option key={index} value={value}>{value}</option>
            ))}
        </select>
    );
};

export default Select;