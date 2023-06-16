import React, { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import { ajax } from 'rxjs/ajax';

const ThemeContext = createContext({});

export const ThemeContextHandler = ({ children }) => {
    const [themes, setThemes] = useState({});

    const updateTheme = useCallback((name, theme) => {
        var status = "update";
        setThemes(prevThemes => {
            if (theme === null) {
                status = "delete";
                const newThemes = {...prevThemes};
                delete newThemes[name];

                return newThemes;
            } else {
                if (theme[name] === undefined)
                    status = "create";
                return {
                    ...prevThemes,
                    [name]: theme
                };
            }
        });
        switch (status) {
            case "create":
                ajax.post("http://localhost:3003/themes/", {[name]: theme}).subscribe();
                break;
            case "delete":
                ajax.delete(`http://localhost:3003/themes/${name}`).subscribe();
                break;
            case "update":
            default:
                ajax.post(`http://localhost:3003/themes/${name}`, theme).subscribe();
                break;
        }
    }, [setThemes]);

    const injectTheme = useCallback((name, theme) => {
        setThemes(prevThemes => ({
            ...prevThemes,
            [name]: theme
        }));
    }, [setThemes]);

    const [name, setName] = useState('light');
    const [theme, setTheme] = useState(themes[name]);

    const selectTheme = useCallback((name) => {
        setName(name);
        setTheme(themes[name] || themes.light);
    }, [setTheme, themes, setName]);

    useEffect(() => {
        ajax.getJSON('http://localhost:3003/themes')
            .subscribe((data) => {
                data.forEach(themeName => {
                    ajax.getJSON(`http://localhost:3003/themes/${themeName}`)
                        .subscribe((data) => {
                            injectTheme(themeName, data);
                        });
                });
            });
    }, [injectTheme]);

    const themeProvider = useMemo(() => ({ theme, name, themes, selectTheme, updateTheme }), [theme, name, themes, selectTheme, updateTheme]);

    return (
        <ThemeContext.Provider value={themeProvider}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
