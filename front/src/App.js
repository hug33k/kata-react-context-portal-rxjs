import React from 'react';
import { ThemeContextHandler } from './contexts/ThemeContext';
import Button from './components/Button';
import Select from './components/Select';
import ThemeSelector from './components/ThemeSelector';
import ThemeManager from './components/ThemeManager';
import ThemesComponents from './components/ThemedComponents';

function App() {
  return (
    <ThemeContextHandler>
      <div className="App">
        <h1>Theme Manager Kata</h1>
        <ThemeManager />
        <ThemeSelector/>
        <form>
          <label>Test Label</label>
          <button className="button">Test Button</button>
          <input type="text" value="Hello world" onChange={(console.log)}/>
        </form>
        <form>
          <ThemesComponents>
            <label>Another Label</label>
            <button className="button">Another Button</button>
            <input type="text" value="Foo" onChange={(console.log)}/>
          </ThemesComponents>
        </form>
        <form>
          <label>Label Again</label>
          <Button>Hello</Button>
          <Select values={['Foo', 'Bar', 'Baz']} onSelect={(console.log)}/>
        </form>
      </div>
    </ThemeContextHandler>
  );
}

export default App;
