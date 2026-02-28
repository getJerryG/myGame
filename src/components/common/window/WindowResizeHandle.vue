<template>
  <div
    class="window-resize-handle window-resize-handle--se"
    @mousedown.stop="startResize"
  ></div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  resize: [direction: string, dx: number, dy: number];
  'resize-end': [];
}>();

const startResize = (event: MouseEvent) => {
  const startPos = { x: event.clientX, y: event.clientY };
  let isResizing = true;

  const handleResize = (e: MouseEvent) => {
    if (!isResizing) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    emit('resize', 'se', dx, dy);
  };

  const stopResize = () => {
    isResizing = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.userSelect = '';
    emit('resize-end');
  };

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  document.body.style.userSelect = 'none';
};
</script>

<style lang="scss" scoped>
.window-resize-handle {
  position: absolute;
  width: 16px;
  height: 16px;
  cursor: se-resize;

  &--se {
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      transparent 50%,
      var(--color-primary-blue) 50%,
      var(--color-primary-blue) 100%
    );
    opacity: 0;
    transition: opacity var(--transition-fast);

    .window:hover & {
      opacity: 0.5;
    }

    &:hover {
      opacity: 1;
    }
  }
}
</style>
