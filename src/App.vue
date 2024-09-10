<script setup>
import Employee from "@/components/Employee.vue";
import {onBeforeMount, ref} from "vue";

let employees = ref(null);
let attempted_to_load_file = ref(false);

onBeforeMount(async () => {
    let res = await fetch("http://localhost:3000/employees").then(async (res) => {
        return await res.json();
    }).catch((e) => {
        alert("Failed to load csv file.");
    });

    // get first 100 for now, optimize for large graph later
    employees.value = res.employees.slice(0,100);
    attempted_to_load_file.value = true;

})

</script>

<template>
    <main>
        <div class="flex w-screen h-screen" v-if="attempted_to_load_file === true && employees == null">
            <span class="flex gap-y-4 flex-col w-fit h-fit m-auto text-center p-4 bg-red-500 bg-opacity-90 text-slate-100 rounded-xl">
                <span class="text-4xl">Failed to load CSV file</span>
                <span class="text-2xl">Go to http://localhost:3000/employees to see if there is a response.</span>
            </span>
        </div>

        <div class="flex flex-col gap-y-2" v-else-if="attempted_to_load_file === true && employees !== null">
            <Employee v-for="employee in employees" :key="employee['Employee ID']" :employee="employee" />
        </div>

    </main>


</template>