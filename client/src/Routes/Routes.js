import React from 'react';
import ManageEmployees from '../Containers/Employees/ManageEmployees';
import ManageUser from '../Containers/User/ManageUser';
import ManageRole from '../Containers/Roles/ManageRole';
import ManageShift from '../Containers/Shift/ManageShifts';
import ManageStates from '../Containers/States/ManageStates';
import ManageCountries from '../Containers/Countries/ManageCountries';
import ManageCities from '../Containers/Cities/ManageCities';
import ManageMeasuringUnits from '../Containers/MeasuringUnits/ManageMeasuringUnits';
import ManageMaterialTypes from '../Containers/MaterialTypes/ManageMaterialTypes';
import ManageRawMaterials from '../Containers/RawMaterials/ManageRawMaterials';
import ManageWorkLocations from '../Containers/WorkLocations/ManageWorkLocations';
import ManageProductionUnits from '../Containers/ProductionUnits/ManageProductionUnits';
import ManageProducts from '../Containers/Products/ManageProducts';
import ManageDepartments from '../Containers/Departments/ManageDepartments';
import ManageVendors from '../Containers/Vendors/ManageVendors';
import ManageDistributors from '../Containers/Distributors/ManageDistributor';
import ManageDesignations from '../Containers/Designations/ManageDesignations';
import ManageBoxes from '../Containers/Boxes/ManageBoxes';

import { Route } from 'react-router-dom';
import { Box } from '@material-ui/core';

export const Routes = () => {
   return (
      <Box style={{ width: '100%' }}>
         <Route
            exact
            path='/home/management/manage-employees'
            component={ManageEmployees}
         />
         <Route path='/home/management/manage-users' component={ManageUser} />
         <Route
            exact
            path='/home/management/manage-roles'
            component={ManageRole}
         />
         <Route
            exact
            path='/home/management/manage-shifts'
            component={ManageShift}
         />
         <Route
            exact
            path='/home/management/manage-countries'
            component={ManageCountries}
         />
         <Route
            exact
            path='/home/management/manage-states'
            component={ManageStates}
         />
         <Route
            exact
            path='/home/management/manage-cities'
            component={ManageCities}
         />
         <Route
            exact
            path='/home/management/manage-measuring-units'
            component={ManageMeasuringUnits}
         />
         <Route
            exact
            path='/home/management/manage-material-types'
            component={ManageMaterialTypes}
         />
         <Route
            exact
            path='/home/management/manage-raw-materials'
            component={ManageRawMaterials}
         />
         <Route
            exact
            path='/home/management/manage-work-locations'
            component={ManageWorkLocations}
         />
         <Route
            exact
            path='/home/management/manage-products'
            component={ManageProducts}
         />
         <Route
            exact
            path='/home/management/manage-production-units'
            component={ManageProductionUnits}
         />
         <Route
            exact
            path='/home/management/manage-departments'
            component={ManageDepartments}
         />
         <Route
            exact
            path='/home/management/manage-vendors'
            component={ManageVendors}
         />
         <Route
            exact
            path='/home/management/manage-distributors'
            component={ManageDistributors}
         />
         <Route
            exact
            path='/home/management/manage-designations'
            component={ManageDesignations}
         />
         <Route
            exact
            path='/home/management/manage-boxes'
            component={ManageBoxes}
         />
      </Box>
   );
};
