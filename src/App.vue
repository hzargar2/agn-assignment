<script setup>
import Employee from "@/components/Employee.vue";
import {onBeforeMount} from "vue";

let users = null;

onBeforeMount(async () => {
    users = await fetch("http://localhost:3000/employees").then(async (res) => {
        return await res.json();
    }).catch((e) => {
        alert("Failed to load csv file.");
    });

    console.log(users.data);

})

</script>

<template>
    <template>
        <div>
            <Employee v-for="node in nodes" :key="node.id" :node="node" />
        </div>
    </template>

</template>