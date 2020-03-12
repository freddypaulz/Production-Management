import React from 'react';
class auth extends React.Component {
   constructor(props) {
      super();
   }
   login = value => {
      console.log(value);
      sessionStorage.setItem('authenticated', value);
   };

   logout = () => {
      sessionStorage.clear();
      return true;
   };

   isAuthenticated() {
      return sessionStorage.getItem('authenticated');
   }
}

export default new auth();
