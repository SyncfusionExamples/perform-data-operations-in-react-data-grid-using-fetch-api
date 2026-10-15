/**
 * Custom Data Service for Grid Operations
 * Handles dataStateChange (paging, sorting, filtering, searching) event
 */

import { DataStateChangeEventArgs, DataSourceChangedEventArgs } from '@syncfusion/ej2-react-grids';
import { Patient } from '../types/interface';

const API_BASE_URL = 'http://localhost:5000/api/patients';

export interface GridDataResponse {
  result: Patient[];
  count: number;
}

export interface GridDataRequest {
  skip?: number;
  take?: number;
  sorted?: Array<{ name: string; direction: string }>;
  where?: any[];
  search?: Array<{ fields: string[]; key: string; operator: string; ignoreCase: boolean }>;
  requiresCounts?: boolean;
}

/**
 * Fetch data based on grid state (paging, sorting, filtering, searching)
 * Triggered by dataStateChange event
 */
export const fetchGridData = async (state: DataStateChangeEventArgs): Promise<GridDataResponse> => {
  try {
    // Map Syncfusion sort format to our format
    // Syncfusion sends direction as "Ascending" or "Descending" (capitalized)
    // Convert to lowercase for consistency
    const mapped_sorted = (state.sorted || []).map((sort: any) => ({
      name: sort.name || sort.key,
      direction: (sort.direction || 'ascending').toLowerCase(),
    }));

    // Map Syncfusion search format to our format
    const mapped_search = (state.search || []).map((search: any) => ({
      fields: search.fields || [],
      key: search.key || '',
      operator: search.operator || 'contains',
      ignoreCase: search.ignoreCase !== false,
    }));

    const request: GridDataRequest = {
      skip: state.skip || 0,
      take: state.take || 12,
      sorted: mapped_sorted,
      where: state.where || [],
      search: mapped_search,
      requiresCounts: true,
    };

    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      result: data.result || [],
      count: data.count || 0,
    };
  } catch (error) {
    console.error('[Grid] Error fetching grid data:', error);
    throw error;
  }
};

