import { useState, useCallback, useRef, MouseEvent } from 'react';

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

  const handleMouseDown = useCallback((e: MouseEvent, itemId: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    cardOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    dragStartPos.current = { x: e.clientX, y: e.clientY };

    setDragState({
      isDragging: true,
      draggedItem: itemId,
      position: { x: e.clientX, y: e.clientY },
      cardDimensions: { width: rect.width, height: rect.height },
    });
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragState.isDragging) {
        setDragState((prev) => ({
          ...prev,
          position: { x: e.clientX, y: e.clientY },
        }));
      }
    },
    [dragState.isDragging]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.draggedItem) return;

      // Find which column the card was dropped in
      const target = document.elementFromPoint(e.clientX, e.clientY);
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
    },
    [dragState, onDrop]
  );

  return {
    dragState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cardOffset: cardOffset.current,
  };
};
