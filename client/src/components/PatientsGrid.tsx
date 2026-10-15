import React, { useState, useEffect, useRef } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Sort,
  Filter,
  Edit,
  Toolbar,
  Search,
  Inject,
  EditSettingsModel,
  ToolbarItems,
  PageSettingsModel,
  DataStateChangeEventArgs,
  DataSourceChangedEventArgs,
} from '@syncfusion/ej2-react-grids';
import { fetchGridData } from '../services/customDataService';
import { Patient } from '../types/interface';

/**
 * Patients detail Grid Component
 * Displays hospital patient records 
 * Uses custom data binding with dataStateChange and dataSourceChanged events
 */
const PatientsGrid: React.FC = () => {
  // State for grid data - complete response object with result and count for custom data binding
  const [gridData, setGridData] = useState<{ result: Patient[]; count: number }>({
    result: [],
    count: 0,
  });

  const [previousState, setPreviousState] = useState<any>(null);
  
  // Reference to grid component and initialization tracker
  const gridRef = useRef<GridComponent>(null);
  const isInitializedRef = useRef<boolean>(false);

  /**
   * Load initial grid data on component mount (only once)
   */
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      const initialState = {
        skip: 0,
        take: 12,
        sorted: [],
        where: [],
        search: [],
        requiresCounts: true,
      };
      setPreviousState(initialState);
      loadGridData(initialState);
    }
  }, []);

  /**
   * Load grid data with current state
   * Called on initial load and when dataStateChange event is triggered
   */
  const loadGridData = async (state: any) => {
    try {
     
      const response = await fetchGridData(state);
      
      // Store complete response object with both result and count for custom data binding
      // The Grid's dataSource must contain the entire object: { result: [...], count: total }
      setGridData({
        result: response.result,
        count: response.count,
      });
      
      console.log('[Component] Grid data loaded successfully:', {
        recordsCount: response.result.length,
        totalCount: response.count,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';

      console.error('[Component] Error loading grid data:', errorMessage);
    } finally {
     
    }
  };

  /**
   * Handle dataStateChange event
   * Triggered when user performs paging, sorting, filtering, or searching
   * Ensures all operations (including search) are sent to the server
   */
  const onDataStateChange = (args: DataStateChangeEventArgs) => {
    
    // Store current state for next comparison
    setPreviousState({
      skip: args.skip,
      take: args.take,
      sorted: args.sorted,
      where: args.where,
      search: args.search,
    });
    
    // Send all state changes to server - including sorting, filtering, and searching
    loadGridData(args);
  };
  
  const pageSettings: PageSettingsModel = {
    pageSize: 12,
    pageSizes: ["12", "25", "50", "100"],
  };


  const toolbar:ToolbarItems[] = ['Search']
  
  return (
    <div className="patients-grid-container">
      <GridComponent
        ref={gridRef}
        dataSource={gridData}
        allowPaging={true}
        allowSorting={true}
        allowFiltering={true}
        pageSettings={pageSettings}
        dataStateChange={onDataStateChange}
        toolbar={toolbar}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="PatientID"
            headerText="Patient ID"
            width="100"
            type="number"
            visible={true}
            textAlign="Right"
          />
          <ColumnDirective
            field="PatientName"
            headerText="Patient Name"
            width="180"
          />
          <ColumnDirective
            field="Age"
            headerText="Age"
            width="80"
            textAlign="Right"
          />
          <ColumnDirective
            field="Gender"
            headerText="Gender"
            width="100"
          />

          <ColumnDirective
            field="Phone"
            headerText="Phone"
            width="140"
          />

          {/* Medical Staff */}
          <ColumnDirective
            field="DoctorName"
            headerText="Doctor Name"
            width="180"
          />
          <ColumnDirective
            field="Specialty"
            headerText="Specialty"
            width="150"
          />
          <ColumnDirective
            field="AdmissionDate"
            headerText="Admission Date"
            width="140"
            type="date"
            format="yMd"
            visible={false}
          />
          <ColumnDirective
            field="Diagnosis"
            headerText="Diagnosis"
            width="200"
            visible={false}
          />
          <ColumnDirective
            field="Status"
            headerText="Status"
            width="150"
            visible={false}
          />
        </ColumnsDirective>

        <Inject services={[Page, Sort, Filter,Search,Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default PatientsGrid;
