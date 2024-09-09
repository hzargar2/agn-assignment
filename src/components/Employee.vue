<script setup>
defineProps({
    node: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <b-alert show class="d-flex justify-content-between mb-1">
        {{ node.label }}
        <span class="fas fa-angle-right" />
    </b-alert>
</template>
