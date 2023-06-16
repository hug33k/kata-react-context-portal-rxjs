import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ThemeContext from '../contexts/ThemeContext';
import './ThemeManager.css';

const themeToJSON = (theme) => {
    const output = {};
    theme.forEach(({key, value}) => {
        if (key && value)
            output[key] = value
    });
    return output;
};

const themeToFormData = (theme) => Object.keys(theme).map((key) => ({ key, value: theme[key] }));

const ThemeEditor = ({ name, theme, disabled, updateTheme, editTheme, deleteTheme }) => {
    const { name: current, selectTheme } = useContext(ThemeContext);
    const [ themeName, setThemeName ] = useState(name);
    const [ data, setData ] = useState(themeToFormData(theme));

    useEffect(() => {
        setData(themeToFormData(theme));
    }, [theme]);

    useEffect(() => {
        setThemeName(name);
    }, [name]);

    const updateName = (e) => {
        e.preventDefault();
        const name = e.target.value;
        setThemeName(name);
    };

    const updateKey = (e) => {
        const index = parseInt(e.target.id.split('-')[0]);
        const key = e.target.value;
        setData(prevData => {
            const newData = [...prevData];
            newData[index].key = key;
            return newData;
        });
    };

    const updateValue = (e) => {
        const index = parseInt(e.target.id.split('-')[0]);
        const value = e.target.value;
        setData(prevData => {
            const newData = [...prevData];
            newData[index].value = value;
            return newData;
        });
    };

    const newField = (e) => {
        e.preventDefault();
        setData(prevData => [...prevData, { key: '', value: '' }]);
    };

    const removeField = (e) => {
        e.preventDefault();
        const index = parseInt(e.target.id.split('-')[0]);
        setData(prevData => {
            const newData = [...prevData];
            newData.splice(index, 1);
            return newData;
        });
    };

    const copyAsJSON = (e) => {
        e.preventDefault();
        const theme = themeToJSON(data);
        navigator.clipboard.writeText(JSON.stringify(theme, null, 2))
            .then(() => alert(`Theme ${themeName} copied to clipboard`));
    };

    return (
        <form onSubmit={(e) => updateTheme(e, themeName, themeToJSON(data))}>
            <fieldset key="name">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    value={themeName}
                    id="name"
                    disabled={disabled}
                    onChange={updateName}
                />
            </fieldset>
            {data.map((field, index) => (
                <fieldset key={index}>
                    <input
                        type="text"
                        value={field.key}
                        id={`${index}-key`}
                        disabled={disabled}
                        onChange={updateKey}
                    />
                    <input
                        type="text"
                        value={field.value}
                        id={`${index}-value`}
                        disabled={disabled}
                        onChange={updateValue}
                    />
                    {!disabled && (
                        <button
                            type="button"
                            id={`${index}-remove`}
                            onClick={removeField}
                        >X</button>
                    )}
                </fieldset>
            ))}
            <fieldset key="add">
                <button type="button" disabled={disabled} onClick={newField}>Add</button>
            </fieldset>
            <div className="thememanager-editor-actions">
                <button type="button" disabled={disabled || (name === current)} onClick={deleteTheme}>Delete</button>
                {disabled ? 
                    (<button type="button" onClick={editTheme} disabled={name === current}>Edit</button>) :
                    (<button type="submit">Save</button>)
                }
                <button type="button" disabled={name === current || !disabled} onClick={() => selectTheme(name)}>Select</button>
                <button type="button" onClick={copyAsJSON}>Copy as JSON</button>
            </div>
        </form>
    );
};

const ThemeManagerModal = ({ toggleClose }) => {
    const { themes, updateTheme } = useContext(ThemeContext);
    const [ selected, setSelected ] = useState(null);
    const [ disabled, setDisabled ] = useState(true);

    const newTheme = () => {
        setSelected("New theme");
        setDisabled(false);
    };

    const selectTheme = (theme) => {
        setSelected(theme);
        setDisabled(true);
    }

    const saveTheme = (e, name, data) => {
        e.preventDefault();
        if (name !== selected)
            deleteTheme(e, selected);
        setSelected(name);
        updateTheme(name, data);
        setDisabled(true);
    };

    const editTheme = (e) => {
        e.preventDefault();
        setDisabled(false);
    };

    const deleteTheme = (e) => {
        e.preventDefault();
        updateTheme(selected, null);
        setSelected(null);
    };

    return (
        <>
            <div className="thememanager-modal-window">
                <header>
                    <h2>Theme Manager</h2>
                    <button id="thememanager-modal-window-close" onClick={toggleClose}>X</button>
                </header>
                <main className="thememanager-modal-window-content">
                    <nav className="thememanager-themes-list">
                        <ul>
                            {Object.keys(themes).map((theme, key) => 
                                (<li
                                    key={key}
                                    className={theme === selected ? 'active' : ''}
                                    onClick={() => selectTheme(theme)}
                                >{theme}</li>))
                            }
                            <li key={-1} className="new" onClick={() => newTheme()}>+ Add new</li>
                        </ul>
                    </nav>
                    <section className="thememanager-editor">
                        {selected && <ThemeEditor
                            name={selected}
                            theme={themes[selected] || {}}
                            disabled={disabled}
                            updateTheme={saveTheme}
                            editTheme={editTheme}
                            deleteTheme={deleteTheme}
                        />}
                    </section>
                </main>
            </div>
            <div className="thememanager-modal-shadow" onClick={toggleClose}></div>
        </>
    )
};

const ThemeManager = () => {
    const [ isOpen, setIsOpen ] = useState(false);

    return (
        <>
            <button onClick={() => setIsOpen(o => !o)}>Open Theme Manager</button>
            {isOpen && createPortal(<ThemeManagerModal toggleClose={() => setIsOpen(false)}/>, document.body)}
        </>
    );
}

export default ThemeManager;
