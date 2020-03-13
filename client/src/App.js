import React from 'react';
import './App.css';
import Home from './Containers/Home/Home';
import Management from './Containers/Management/Management';
import Login from './Containers/Login/Login';
import { BrowserRouter, Route } from 'react-router-dom';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import Requests from './Containers/Requests/Requests';
import Reports from './Containers/Reports/Reports';
import PurchaseManagement from './Containers/Purchase/PurchaseManagement';
import FinanceManagement from './Containers/Finance/FinanceManagement';
import ProductionManagement from './Containers/Production/ProductionManagement';
import Configurations from './Containers/Configurations/Configurations';

function App() {
   return (
      <BrowserRouter>
         <Route path='/' exact component={Login} />
         <ProtectedRoute exact path='/home' component={Home} />
         <ProtectedRoute path='/home/management' component={Management} />
         <ProtectedRoute path='/home/requests' component={Requests} />
         <ProtectedRoute path='/home/reports' component={Reports} />
         <ProtectedRoute
            path='/home/configurations'
            component={Configurations}
         />
         <ProtectedRoute path='/home/purchase' component={PurchaseManagement} />
         <ProtectedRoute path='/home/finance' component={FinanceManagement} />
         <ProtectedRoute
            path='/home/production'
            component={ProductionManagement}
         />
      </BrowserRouter>
   );
}

export default App;
