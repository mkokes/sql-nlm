import { renderHook, act } from '@testing-library/react';
import { useToast } from './use-toast';

// Reset the toast state between tests
beforeEach(() => {
  jest.resetModules();
});

describe('useToast hook', () => {
  it('should return an empty toasts array initially', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toasts).toEqual([]);
  });

  it('should add a toast when toast() is called', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: 'Test Toast',
        description: 'This is a test toast',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
    expect(result.current.toasts[0].description).toBe('This is a test toast');
    expect(result.current.toasts[0].open).toBe(true);
  });

  it('should dismiss a toast when dismiss() is called with an ID', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;

    act(() => {
      const { id } = result.current.toast({
        title: 'Test Toast',
        description: 'This is a test toast',
      });
      toastId = id;
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(toastId);
    });

    // The toast should still be in the array but with open=false
    expect(result.current.toasts[0].open).toBe(false);
  });

  it('should update a toast when update() is called', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;

    act(() => {
      const { id, update } = result.current.toast({
        title: 'Test Toast',
        description: 'This is a test toast',
      });

      toastId = id;

      update({
        id,
        title: 'Updated Toast',
        description: 'This is an updated toast',
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].id).toBe(toastId);
    expect(result.current.toasts[0].title).toBe('Updated Toast');
    expect(result.current.toasts[0].description).toBe('This is an updated toast');
  });
});
