<script setup>

import {create_graph_at_element_id} from "@/assets/tree.js";
import {onMounted} from "vue";

onMounted(() => {
    create_graph_at_element_id("#tree-graph");
})

</script>

<template>
  <div id="tree-graph"></div>
</template>
