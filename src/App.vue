<script setup>
import {onBeforeMount, onMounted, ref} from "vue";
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

onBeforeMount(async () => {

    let res = await fetch("http://localhost:3000/employees");

    // set status so can show error message to user
    if (res.status !== 200){
        failed_to_fetch_data.value = true;
    }

    let res_data_as_json = await res.json();

    // get first 100 for now, optimize for large graph later
    employees.value = res_data_as_json.data;

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

})

</script>


<template>
    <main>
        <div class="flex w-screen h-screen" v-if="failed_to_fetch_data && data_ready">
            <span class="flex gap-y-4 flex-col w-fit h-fit m-auto text-center p-4 bg-rose-500 text-slate-100 rounded-xl">
                <span class="text-4xl">Failed to load CSV file</span>
                <span class="text-2xl">Go to http://localhost:3000/employees to see if there is a response.</span>
            </span>
        </div>

        <div class="flex w-screen h-screen" v-else-if="!failed_to_fetch_data && !data_ready">
            <span class="flex flex-row gap-y-4 w-fit h-fit m-auto text-center p-4 bg-emerald-500 text-slate-100 rounded-xl">
                <svg class="m-auto animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="m-auto text-2xl">Loading...</span>
            </span>
        </div>

        <!--        Add root element in chart-->
        <div class="flex min-h-screen w-full h-full" v-else>
<!--                Need to use a separate component to render D3 tree since we need parent div to render before chart
javascript can inject html into DOM, div in component is not conditionally rendered so javascript function can inject
the html into the DOM but not here. DOM updates after onMounted is run so if javascript is executed in this component
it won;t work since DOM hasn't updated yet to include the div that contains the child element but if run the javascript
in a separate file where element is already rendered (e no conditional rendering then can javascript can inject html
and update the DOM successfully  -->
              <EmployeeTree :employees_json="employees" graph_dom_id="tree_graph"/>
        </div>
    </main>
</template>
