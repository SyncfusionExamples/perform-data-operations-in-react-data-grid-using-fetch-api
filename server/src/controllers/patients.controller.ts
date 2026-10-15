import { Request, Response } from 'express';
import { generatePatients } from '../utils/data';
import { DataManagerRequest, Patient } from '../types/interface';

let patients: Patient[] = generatePatients(1000);

export const getPatients = (req: Request, res: Response) => {
  try {
    const dm: DataManagerRequest = req.body || {};

    let result = [...patients];

    // Apply filters
    if (dm.where && dm.where.length > 0) {
      result = applyWhere(result, dm.where);
    }

    // Apply search - Server-side search
    if (dm.search && dm.search.length > 0) {
      result = applySearch(result, dm.search);
    }

    // Get total count before paging (for accurate pagination)
    const count = result.length;

    // Apply sort
    if (dm.sorted && dm.sorted.length > 0) {
      result = applySort(result, dm.sorted);
    }

    // Apply paging
    const skip: number = dm.skip as number || 0;
    const take: number = dm.take as number || 12;
    const pageResult = result.slice(skip, skip + take);
    

    // Always return in {result, count} format for custom data binding
    res.json({
      result: pageResult,
      count: count
    });
  } catch (error) {
    console.error('[API] Error in getPatients:', error);
    res.status(500).json({
      error: 'Failed to retrieve patients',
      result: [],
      count: 0
    });
  }
};


const applyWhere = (data: Patient[], where: any[]): Patient[] => {
  if (!where || where.length === 0) return data;

  return data.filter(item => {
    return evaluatePredicateGroup(item, where, 'and');
  });
};

const evaluatePredicateGroup = (item: any, predicates: any[], logic: string = 'and'): boolean => {
  const logicFunc = logic.toLowerCase() === 'or' ? (a: boolean, b: boolean) => a || b : (a: boolean, b: boolean) => a && b;
  let result = logic.toLowerCase() === 'or' ? false : true;

  for (const pred of predicates) {
    let conditionResult: boolean;

    if (pred.isComplex && pred.predicates) {
      conditionResult = evaluatePredicateGroup(item, pred.predicates, pred.condition || 'and');
    } else {
      conditionResult = evaluatePredicate(item, pred);
    }

    result = logicFunc(result, conditionResult);
  }

  return result;
};

const evaluatePredicate = (item: any, pred: any): boolean => {
  const field = pred.field || pred.name;
  const operator = pred.operator;
  const value = pred.value;
  const ignoreCase = pred.ignoreCase !== false;

  if (!field || item[field] === undefined) return true;

  const itemValue = ignoreCase && typeof item[field] === 'string'
    ? item[field].toLowerCase()
    : item[field];

  const compareValue = ignoreCase && typeof value === 'string'
    ? value.toLowerCase()
    : value;

  switch (operator) {
    case 'equal':
      return itemValue === compareValue;
    case 'notequal':
      return itemValue !== compareValue;
    case 'greaterthan':
      return itemValue > compareValue;
    case 'greaterthanorequal':
      return itemValue >= compareValue;
    case 'lessthan':
      return itemValue < compareValue;
    case 'lessthanorequal':
      return itemValue <= compareValue;
    case 'contains':
      return String(itemValue).includes(String(compareValue));
    case 'startswith':
      return String(itemValue).startsWith(String(compareValue));
    case 'endswith':
      return String(itemValue).endsWith(String(compareValue));
    case 'in':
      return Array.isArray(value) ? value.includes(itemValue) : itemValue === value;
    case 'notin':
      return Array.isArray(value) ? !value.includes(itemValue) : itemValue !== value;
    case 'isnull':
      return itemValue === null || itemValue === undefined;
    case 'isnotnull':
      return itemValue !== null && itemValue !== undefined;
    default:
      return true;
  }
};

const applySearch = (data: Patient[], search: any[]): Patient[] => {
  if (!search || search.length === 0) return data;

  return data.filter(item => {
    
    return search.every(s => {
      const fields = s.fields || [];
      const key = s.key || '';
      const operator = s.operator || 'contains';
      const ignoreCase = s.ignoreCase !== false;

      if (!fields.length || !key) return true;
      const searchKey = ignoreCase ? key.toLowerCase() : key;

      return fields.some((field: string) => {
        const fieldValue = item[field as keyof Patient];
        
        if (fieldValue === undefined || fieldValue === null) return false;

        const compareValue = ignoreCase && typeof fieldValue === 'string'
          ? (fieldValue as string).toLowerCase()
          : fieldValue;

        if (operator === 'contains') {
          return String(compareValue).includes(searchKey);
        } else if (operator === 'equal') {
          return String(compareValue) === searchKey;
        } else if (operator === 'startswith') {
          return String(compareValue).startsWith(searchKey);
        } else if (operator === 'endswith') {
          return String(compareValue).endsWith(searchKey);
        }
        
        return false;
      });
    });
  });
};

const applySort = (data: Patient[], sorted: any[]): Patient[] => {
  if (!sorted || sorted.length === 0) return data;

  const result = [...data];
  sorted.forEach(sort => {

    const normalizedDirection = String(sort.direction || 'ascending').toLowerCase();
    const direction = normalizedDirection === 'descending' ? -1 : 1;
    result.sort((a, b) => {
      const aVal = a[sort.name as keyof Patient];
      const bVal = b[sort.name as keyof Patient];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return direction;
      if (bVal == null) return -direction;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * direction;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.toLowerCase().localeCompare(bVal.toLowerCase());
        return comparison * direction;
      }
      
      if (aVal < bVal) return -direction;
      if (aVal > bVal) return direction;
      return 0;
    });
  });
  return result;
};