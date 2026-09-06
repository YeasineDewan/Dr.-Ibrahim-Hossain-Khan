import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdvancedFilter } from './advanced-filter';

describe('useAdvancedFilter', () => {
  const mockItems = [
    { id: 1, name: 'Alice', age: 30, city: 'New York', status: 'active' },
    { id: 2, name: 'Bob', age: 25, city: 'London', status: 'inactive' },
    { id: 3, name: 'Charlie', age: 35, city: 'New York', status: 'active' },
    { id: 4, name: 'Diana', age: 28, city: 'Paris', status: 'active' },
    { id: 5, name: 'Eve', age: 32, city: 'London', status: 'inactive' },
  ];

  const mockFields = [
    { key: 'name', label: 'Name', type: 'text' as const },
    { key: 'age', label: 'Age', type: 'number' as const },
    { key: 'city', label: 'City', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'text' as const },
  ];

  it('should return all items when no conditions', () => {
    const { result } = renderHook(() =>
      useAdvancedFilter({
        items: mockItems,
        conditions: [],
        onConditionsChange: () => {},
        fields: mockFields,
      })
    );

    expect(result.current.filtered).toHaveLength(5);
  });

  it('should filter by text contains', () => {
    const { result } = renderHook(() =>
      useAdvancedFilter({
        items: mockItems,
        conditions: [{ id: '1', field: 'name', operator: 'contains', value: 'li' }],
        onConditionsChange: () => {},
        fields: mockFields,
      })
    );

    expect(result.current.filtered).toHaveLength(2);
    expect(result.current.filtered.map((i: any) => i.name)).toEqual(['Alice', 'Charlie']);
  });

  it('should filter by equals', () => {
    const { result } = renderHook(() =>
      useAdvancedFilter({
        items: mockItems,
        conditions: [{ id: '1', field: 'city', operator: 'eq', value: 'New York' }],
        onConditionsChange: () => {},
        fields: mockFields,
      })
    );

    expect(result.current.filtered).toHaveLength(2);
    expect(result.current.filtered.map((i: any) => i.name)).toEqual(['Alice', 'Charlie']);
  });

  it('should filter by greater than', () => {
    const { result } = renderHook(() =>
      useAdvancedFilter({
        items: mockItems,
        conditions: [{ id: '1', field: 'age', operator: 'gt', value: 30 }],
        onConditionsChange: () => {},
        fields: mockFields,
      })
    );

    expect(result.current.filtered).toHaveLength(2);
    expect(result.current.filtered.map((i: any) => i.name)).toEqual(['Charlie', 'Eve']);
  });

  it('should filter by startsWith', () => {
    const { result } = renderHook(() =>
      useAdvancedFilter({
        items: mockItems,
        conditions: [{ id: '1', field: 'name', operator: 'startsWith', value: 'A' }],
        onConditionsChange: () => {},
        fields: mockFields,
      })
    );

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].name).toBe('Alice');
  });

  it('should add and remove conditions', () => {
    const conditions: any[] = [];
    const { result } = renderHook(() =>
      useAdvancedFilter({
        items: mockItems,
        conditions,
        onConditionsChange: (newConditions) => {
          conditions.length = 0;
          conditions.push(...newConditions);
        },
        fields: mockFields,
      })
    );

    act(() => {
      result.current.addCondition();
    });
    expect(conditions).toHaveLength(1);

    act(() => {
      result.current.removeCondition(conditions[0].id);
    });
    expect(conditions).toHaveLength(0);
  });

  it('should clear all conditions', () => {
    const conditions = [
      { id: '1', field: 'name', operator: 'contains', value: 'li' },
      { id: '2', field: 'city', operator: 'eq', value: 'New York' },
    ];
    const { result } = renderHook(() =>
      useAdvancedFilter({
        items: mockItems,
        conditions,
        onConditionsChange: (newConditions) => {
          conditions.length = 0;
          conditions.push(...newConditions);
        },
        fields: mockFields,
      })
    );

    act(() => {
      result.current.clearAll();
    });
    expect(conditions).toHaveLength(0);
  });
});
