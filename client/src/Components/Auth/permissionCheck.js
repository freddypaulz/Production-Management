const permissionCheck = (props, component) => {
   const permissions = JSON.parse(sessionStorage.getItem('permissions'));
   console.log(permissions);
   const checkPermission = permissions.find(permission => {
      return permission === component;
   });
   console.log(typeof checkPermission);
   if (typeof checkPermission === 'undefined') {
      props.history.push({
         pathname: '/home',
         state: {
            msg: 'Permission not Granted. Contact Administrator'
         }
      });
      return false;
   } else {
      return true;
   }
};
export default permissionCheck;
