import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './components/App'
import Home from './components/Home'
import About from './components/simple-pages/About'
import Glossary from './components/simple-pages/Glossary'
import Contact from './components/simple-pages/Contact'
import Search from './components/Search'
import Building from './components/Building'
import Authenticate from './components/auth/Authenticate'
import Admin from './components/admin/Admin'
import './styles/styles'

ReactDOM.render(
  <Router history={browserHistory}>
    <Route component={App}>
      <Route path='/' component={Home} />
      <Route path='/about' component={About} />
      <Route path='/glossary' component={Glossary} />
      <Route path='/contact' component={Contact} />
      <Route path='/search' component={Search} />
      <Route path='/building' component={Building} />
      <Route path='/login' component={Authenticate} />
      <Route path='/admin' component={Admin} />
    </Route>
  </Router>,
  document.getElementById('app')
);