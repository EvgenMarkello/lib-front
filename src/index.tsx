import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Tablets from './components/Tablets/Tablets';
import Tablet from './components/Tablets/Tablet';
import Nietzsche from './components/Tablets/Nietzsche'
import Private from './components/private/Private'
import LoadBook from './components/private/LoadBook'
import Adds from './components/private/Adds'
import BookC from './components/private/BookC'
import Admin from './components/private/Admin'

interface IApplicationProps {}

const Application: React.FunctionComponent<IApplicationProps> = (props) => {
    return <BrowserRouter>
               <Routes>
               <Route path='/' element={<Nietzsche />} />
               <Route path='/private' element={<Private />} />
               <Route path='/private/:token/' element={<Adds />} />
               <Route path='/private/:token/:bId/load' element={<LoadBook />} />
               <Route path='/private/:token/:bId' element={<BookC />} />
               <Route path='/private/:token/:bId/admin' element={<Admin />} />
               <Route path='book/:bid' element={<Tablet />} />
               <Route path='bookc/:bid' element={<Tablet />} />
               <Route path='lbid/:LBId/rbid/:RBId/chid/:ChId' element={<Tablets />} />
               </Routes>
               </BrowserRouter>
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
  <Application/>
  </React.StrictMode>
)