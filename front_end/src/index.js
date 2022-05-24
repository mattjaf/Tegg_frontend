import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MoralisProvider } from 'react-moralis';
import Tokenid0 from './components/pages/tokenid0';


ReactDOM.render((
    <MoralisProvider
        serverUrl="https://sq1cosmtdu4e.usemoralis.com:2053/server"
        appId="hzxvpNx4hB30eoTun2ioSLbmJBdFtNbLZd306Chm"
    >
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/tokenid0" element={<Tokenid0 />} />
            </Routes>
        </BrowserRouter>
    </MoralisProvider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
