import React from 'react';
import 'antd/dist/antd.css';

import './Styles/main.scss';

import MineSweep from './Components/MineSweep/MineSweep';

function App() {
  return (
    <div className="App">
      <div className='games'>
        <MineSweep/>
      </div>
    </div>
  );
}

export default App;
