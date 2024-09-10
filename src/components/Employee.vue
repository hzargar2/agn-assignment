<script setup>
defineProps({
    employee: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="flex">
        <span class="flex">{{ employee }}</span>
    </div>
</template>
