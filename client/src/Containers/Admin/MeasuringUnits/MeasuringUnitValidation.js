const errorCheck = event => {
   let status = false;
   let msg = '';
   let isValid = false;
   const { name, value } = event.target;
   switch (name) {
      case 'measuring_unit_name': {
         if (value.length > 20) {
            status = true;
            msg = 'must have less than 20 characters';
         } else if (value.length === 0) {
            status = true;
            msg = 'Name required';
         } else {
            status = false;
            msg = '';
            isValid = true;
         }
         break;
      }
      case 'description': {
         if (value.length > 200) {
            status = true;
            msg = 'must have less than 200 characters';
         } else {
            status = false;
            msg = '';
            isValid = true;
         }
         break;
      }
      default: {
         break;
      }
   }
   return { status, msg, isValid };
};

export default errorCheck;
