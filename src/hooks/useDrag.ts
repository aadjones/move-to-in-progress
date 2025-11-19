import { useState, useCallback, useRef, MouseEvent, TouchEvent } from 'react';

export interface DragState {
  isDragging: boolean;
  draggedItem: string | null;
  position: { x: number; y: number };
  cardDimensions: { width: number; height: number };
}

export const useDrag = (onDrop: (itemId: string, column: string, dropPosition: { x: number; y: number }, cardWidth: number) => void) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    position: { x: 0, y: 0 },
    cardDimensions: { width: 0, height: 0 },
  });

  const dragStartPos = useRef({ x: 0, y: 0 });
  const cardOffset = useRef({ x: 0, y: 0 });

  const startDrag = useCallback((clientX: number, clientY: number, itemId: string, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    cardOffset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    dragStartPos.current = { x: clientX, y: clientY };

    setDragState({
      isDragging: true,
      draggedItem: itemId,
      position: { x: clientX, y: clientY },
      cardDimensions: { width: rect.width, height: rect.height },
    });
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent, itemId: string) => {
    startDrag(e.clientX, e.clientY, itemId, e.currentTarget as HTMLElement);
  }, [startDrag]);

  const handleTouchStart = useCallback((e: TouchEvent, itemId: string) => {
    // Note: preventDefault() removed - using CSS touch-action instead
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY, itemId, e.currentTarget as HTMLElement);
  }, [startDrag]);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (dragState.isDragging) {
      setDragState((prev) => ({
        ...prev,
        position: { x: clientX, y: clientY },
      }));
    }
  }, [dragState.isDragging]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    },
    [updatePosition]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      // Note: preventDefault() removed - using CSS touch-action instead
      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    },
    [updatePosition]
  );

  const endDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragState.isDragging || !dragState.draggedItem) return;

    // Find which column the card was dropped in
    const target = document.elementFromPoint(clientX, clientY);
    const column = target?.closest('[data-column]');
    const columnName = column?.getAttribute('data-column');

    if (columnName) {
      // Pass the actual drop position and card width
      onDrop(
        dragState.draggedItem,
        columnName,
        {
          x: dragState.position.x - cardOffset.current.x,
          y: dragState.position.y - cardOffset.current.y
        },
        dragState.cardDimensions.width
      );
    }

    setDragState({
      isDragging: false,
      draggedItem: null,
      position: { x: 0, y: 0 },
      cardDimensions: { width: 0, height: 0 },
    });
  }, [dragState, onDrop]);

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      endDrag(e.clientX, e.clientY);
    },
    [endDrag]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      endDrag(touch.clientX, touch.clientY);
    },
    [endDrag]
  );

  return {
    dragState,
    handleMouseDown,
    handleTouchStart,
    handleMouseMove,
    handleTouchMove,
    handleMouseUp,
    handleTouchEnd,
    cardOffset: cardOffset.current,
  };
};
