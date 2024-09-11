<script setup>
import Employee from "@/components/Employee.vue";
import {onBeforeMount, onMounted, onUpdated, reactive, ref} from "vue";
import {create_graph_at_element_id} from "@/assets/tree.js";
import {zoom} from "@/assets/zoom.js";
import {create_employee_and_children_map} from "@/assets/data.js";
import {
    calculate_descendant_count,
    calculate_ic_cost,
    calculate_management_cost, calculate_management_cost_ratio,
    calculate_total_cost
} from "@/assets/metrics.js";
import EmployeeTree from "@/components/EmployeeTree.vue";

let employees = ref(null);
let data_ready = ref(false);
let failed_to_fetch_data = ref(false);
let employees_with_children = {};

onMounted(async () => {

    let res = await fetch("http://localhost:3000/employees");

    // set status so can show error message to user
    if (res.status !== 200){
        failed_to_fetch_data.value = true;
    }

    let res_data_as_json = await res.json();

    // get first 100 for now, optimize for large graph later
    employees.value = res_data_as_json.data.slice(0, 100);

    // creates employees with children, needed to be able to calculate metrics efficiently
    employees_with_children = create_employee_and_children_map(employees.value);

    // calculate employee metrics
    calculate_descendant_count(employees_with_children[0], employees_with_children);
    calculate_management_cost(employees_with_children[0], employees_with_children);
    calculate_ic_cost(employees_with_children[0], employees_with_children);
    calculate_total_cost(employees_with_children[0], employees_with_children);
    calculate_management_cost_ratio(employees_with_children[0], employees_with_children);

    // console.log(employees_with_children);
    // set flag to update DOM
    data_ready.value = true;

    // create Zoom button event listeners on mount
    zoom(1, 0.2, "zoomIn", "zoomOut", "zoomtext");
})

</script>


<template>
    <main>
        <div class="fixed z-20 top-0 right-0 space-x-4 py-6 px-12">
            <button class="rounded-full bg-gray-300 hover:bg-gray-400 h-12 w-12 text-3xl text-gray-600 text-center" id="zoomOut">-</button>
            <button class="rounded-full bg-gray-300 hover:bg-gray-400 h-12 w-12 text-3xl text-gray-600 text-center" id="zoomIn">+</button>
        </div>

        <div class="flex w-screen h-screen" v-if="failed_to_fetch_data && data_ready">
            <span class="flex gap-y-4 flex-col w-fit h-fit m-auto text-center p-4 bg-red-500 bg-opacity-90 text-slate-100 rounded-xl">
                <span class="text-4xl">Failed to load CSV file</span>
                <span class="text-2xl">Go to http://localhost:3000/employees to see if there is a response.</span>
            </span>
        </div>

        <div class="flex w-screen h-screen" v-else-if="!failed_to_fetch_data && !data_ready">
            <span class="flex gap-y-4 flex-col w-fit h-fit m-auto text-center p-4 bg-red-500 bg-opacity-90 text-slate-100 rounded-xl">
                <span class="text-4xl">Loading...</span>
            </span>
        </div>

        <!--        Add root element in chart-->
        <div id="zoomtext" class="flex min-h-screen mt-32 w-full h-full" v-else>
            <div class="flex justify-center m-auto pb-72">
<!--                Need to use a separate component to render D3 tree since we need parent div to render before chart
javascript can inject html into DOM, div in component is not conditionally rendered so javascript function can inject
the html into the DOM but not here. DOM updates after onMounted is run so if javascript is executed in this component
it won;t work since DOM hasn't updated yet to include the div that contains the child element but if run the javascript
in a separate file where element is already rendered (e no conditional rendering then can javascript can inject html
and update the DOM successfully  -->
                <EmployeeTree :employees_json="employees"/>
            </div>
        </div>
    </main>
</template>

<style>

    #zoomtext {
        transform: scale(1);
        transition: transform 0.2s ease-in-out;
    }
    .node circle {
        fill: #fff;
        stroke: steelblue;
        stroke-width: 3px;
    }

    .node text {
        font: 12px sans-serif;
    }

    .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 2px;
    }
</style>