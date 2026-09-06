'use client';

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import type { DashboardLayout, WidgetConfig } from '@/lib/dashboard/types';
import { useDashboardStore } from '@/lib/dashboard/store';
import { getWidget } from '@/lib/dashboard/registry';
import { WidgetRenderer } from '@/components/dashboard/WidgetRenderer';

interface SortableWidgetProps {
  id: string;
  layout: DashboardLayout;
  onEditToggle: () => void;
  editMode: boolean;
}

function SortableWidget({ id, layout, onEditToggle, editMode }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !editMode });

  const widget = layout.widgets.find((w) => w.id === id);
  const definition = widget ? getWidget(widget.id) : undefined;

  const style: React.CSSProperties = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
  };

  if (!widget) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={editMode ? 'widget-edit-mode' : ''}
    >
      <div style={{
        height: '100%',
        minHeight: 120,
        borderRadius: 12,
        border: editMode ? '2px dashed rgba(20,184,166,0.3)' : '1px solid rgba(148,163,184,0.08)',
        background: editMode ? 'rgba(20,184,166,0.02)' : 'transparent',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {editMode && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 8px',
            borderBottom: '1px solid rgba(148,163,184,0.08)',
            cursor: 'grab',
          }} {...attributes} {...listeners}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#647985' }}>
              {definition?.title ?? id}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={(e) => { e.stopPropagation(); console.log('[Widget] Configure:', id); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#647985' }}
              >
                ⚙
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); console.log('[Widget] Remove:', id); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#ef4444' }}
              >
                ×
              </button>
            </div>
          </div>
        )}
        <div style={{ flex: 1, minHeight: 0 }}>
          <WidgetRenderer widgetId={widget.id} data={{ config: widget.config }} />
        </div>
      </div>
    </div>
  );
}

export function DraggableGrid({ layout }: { layout: DashboardLayout }) {
  const [editMode, setEditMode] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const updateWidgetPosition = useDashboardStore((s) => s.updateWidgetPosition);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeWidget = layout.widgets.find((w) => w.id === String(active.id));
    const overWidget = layout.widgets.find((w) => w.id === String(over.id));

    if (activeWidget && overWidget) {
      updateWidgetPosition(active.id as string, overWidget.x, overWidget.y, activeWidget.w, activeWidget.h);
    }
  };

  if (layout.widgets.length === 0) {
    return (
      <div style={{
        height: 200,
        borderRadius: 12,
        border: '2px dashed rgba(148,163,184,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: '#647985',
        fontSize: 13,
      }}>
        <span>No widgets configured</span>
        <button
          onClick={() => console.log('[Dashboard] Open widget picker')}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid rgba(20,184,166,0.3)',
            background: 'rgba(20,184,166,0.06)',
            color: '#0d9488',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          + Add Widget
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button
          onClick={() => setEditMode(!editMode)}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            background: editMode ? 'rgba(20,184,166,0.1)' : '#fff',
            color: editMode ? '#0d9488' : '#334155',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {editMode ? '✓ Done' : 'Customize'}
        </button>
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={layout.widgets.map((w) => String(w.id))} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {layout.widgets.map((widget) => (
              <SortableWidget
                key={widget.id}
                id={widget.id}
                layout={layout}
                onEditToggle={() => setEditMode(!editMode)}
                editMode={editMode}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && (
            <div style={{
              padding: 12,
              borderRadius: 12,
              background: '#fff',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              opacity: 0.9,
            }}>
              {getWidget(activeId)?.title ?? activeId}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
