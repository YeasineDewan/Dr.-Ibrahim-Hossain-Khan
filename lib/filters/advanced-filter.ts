import { useMemo, useCallback, useRef, useEffect } from 'react';

export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'between' | 'isNull' | 'isNotNull';

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  valueEnd?: any;
}

export interface AdvancedFilterOptions<T> {
  items: T[];
  conditions: FilterCondition[];
  onConditionsChange: (conditions: FilterCondition[]) => void;
  fields: { key: string; label: string; type: 'text' | 'number' | 'date' | 'select' | 'boolean' }[];
  debounceMs?: number;
}

export function useAdvancedFilter<T>({
  items,
  conditions,
  onConditionsChange,
  fields,
  debounceMs = 150,
}: AdvancedFilterOptions<T>): { filtered: T[]; addCondition: () => void; removeCondition: (id: string) => void; updateCondition: (id: string, patch: Partial<FilterCondition>) => void; clearAll: () => void } {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const evaluate = useCallback(
    (item: T, condition: FilterCondition): boolean => {
      const value = (item as any)[condition.field];
      const target = condition.value;
      const targetEnd = condition.valueEnd;

      switch (condition.operator) {
        case 'eq':
          return value == target;
        case 'neq':
          return value != target;
        case 'gt':
          return Number(value) > Number(target);
        case 'gte':
          return Number(value) >= Number(target);
        case 'lt':
          return Number(value) < Number(target);
        case 'lte':
          return Number(value) <= Number(target);
        case 'contains':
          return String(value ?? '').toLowerCase().includes(String(target).toLowerCase());
        case 'startsWith':
          return String(value ?? '').toLowerCase().startsWith(String(target).toLowerCase());
        case 'endsWith':
          return String(value ?? '').toLowerCase().endsWith(String(target).toLowerCase());
        case 'in':
          return Array.isArray(target) ? target.includes(value) : false;
        case 'between':
          return Number(value) >= Number(target) && Number(value) <= Number(targetEnd ?? target);
        case 'isNull':
          return value == null || value === '';
        case 'isNotNull':
          return value != null && value !== '';
        default:
          return true;
      }
    },
    []
  );

  const filtered = useMemo(() => {
    if (conditions.length === 0) return items;
    return items.filter((item) => conditions.every((c) => evaluate(item, c)));
  }, [items, conditions, evaluate]);

  const addCondition = useCallback(() => {
    onConditionsChange([
      ...conditions,
      { id: crypto.randomUUID(), field: fields[0]?.key ?? '', operator: 'contains', value: '' },
    ]);
  }, [conditions, fields, onConditionsChange]);

  const removeCondition = useCallback(
    (id: string) => {
      onConditionsChange(conditions.filter((c) => c.id !== id));
    },
    [conditions, onConditionsChange]
  );

  const updateCondition = useCallback(
    (id: string, patch: Partial<FilterCondition>) => {
      onConditionsChange(conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    },
    [conditions, onConditionsChange]
  );

  const clearAll = useCallback(() => {
    onConditionsChange([]);
  }, [onConditionsChange]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { filtered, addCondition, removeCondition, updateCondition, clearAll };
}
