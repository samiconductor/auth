<template>
  <div>{{ edits }}</div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      edits: {}
    };
  }
};
</script>
