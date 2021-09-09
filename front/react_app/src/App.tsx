import React from 'react';
import './App.css';
import Layout from './components/Layout';
import {BrowserRouter as Router, Route} from "react-router-dom";
import NewModelForm from './components/NewModelForm';
import WordCloudResult from "./components/WordCloudResult";

function App() {
  return (
    <Router>
      <Layout>
        <div className="flex space-x-4">
          <Route exact path='/' component={NewModelForm} />
          <Route exact path='/Result' component={WordCloudResult} />
        </div>
      </Layout>
    </Router>
  );
}

export default App;
