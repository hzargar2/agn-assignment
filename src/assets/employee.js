export const construct_employee_html = (employee, dx, dy) => {

    let background_color;
    let background_text;

    if (employee.data["Department"].toLowerCase().includes("operations")){
        background_color = "bg-lime-50 hover:bg-lime-100";
        background_text = "bg-lime-200";
    }else if (employee.data["Department"].toLowerCase().includes("sales")) {
        background_color = "bg-emerald-50 hover:bg-emerald-100";
        background_text = "bg-emerald-200";
    }else if (employee.data["Department"].toLowerCase().includes("data analytics")) {
        background_color = "bg-teal-50 hover:bg-teal-100";
        background_text = "bg-teal-200";
    }
    else if (employee.data["Department"].toLowerCase().includes("customer support")) {
        background_color = "bg-cyan-50 hover:bg-cyan-100";
        background_text = "bg-cyan-200";
    }
    else if (employee.data["Department"].toLowerCase().includes("system")) {
        background_color = "bg-indigo-50 hover:bg-indigo-100";
        background_text = "bg-indigo-200";
    }
    else if (employee.data["Department"].toLowerCase().includes("project")) {
        background_color = "bg-purple-50 hover:bg-purple-100";
        background_text = "bg-purple-200";
    }
    else if (employee.data["Department"].toLowerCase().includes("human resources")) {
        background_color = "bg-rose-50 hover:bg-rose-100";
        background_text = "bg-rose-200";
    }
    else if (employee.data["Department"].toLowerCase().includes("software")) {
        background_color = "bg-amber-50 hover:bg-amber-100";
        background_text = "bg-amber-200";
    }
    else{
        background_color = "bg-stone-50 hover:bg-stone-100";
        background_text = "bg-stone-200";
    }

    return `
                <foreignObject x="-120" y="0" width="${dx}" height="${dy}">
                    <div class="w-full h-full flex flex-col p-4 gap-y-2 rounded-lg shadow hover:cursor-pointer ${background_color}">
                        <div class="flex flex-col gap-y-1 mt-0 m-auto">
                            <span class="flex font-medium mx-auto text-lg">${employee.data["Name"]}</span>
                            <span class="flex text-center mx-auto text-gray-600 text-lg">${employee.data["Job Title"]}</span>
                        </div>
                        
                        <div class="flex flex-col gap-1 mb-0 m-auto text-sm">
      
                            <!--                Calculate numeric values for styling inline-->
                            <span class="flex text-center px-2 py-0.5 rounded-2xl m-auto border-2 border-gray-800 border-opacity-60 ${background_text}">${employee.data["Department"]}</span>
                            <span class="flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}">Level ${employee.data["level"]}</span>
                            <span class="flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}">Management cost: $${employee.data["management_cost"] > 1000000000 ? (Math.round((employee.data["management_cost"] + Number.EPSILON) / 1000000000 * 100) / 100) + "B" : employee.data["management_cost"] > 1000000 ? (Math.round((employee.data["management_cost"] + Number.EPSILON) / 1000000 * 100) / 100) + "M" : (Math.round((employee.data["management_cost"] / 1000 + Number.EPSILON) * 100) / 100) + "K"}</span>
                            <span class="flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}">IC cost: $${employee.data["ic_cost"] > 1000000000 ? (Math.round((employee.data["ic_cost"] + Number.EPSILON) / 1000000000 * 100) / 100) + "B" : employee.data["ic_cost"] > 1000000 ? (Math.round((employee.data["ic_cost"] + Number.EPSILON) / 1000000 * 100) / 100) + "M" : (Math.round((employee.data["ic_cost"] / 1000 + Number.EPSILON) * 100) / 100) + "K"}</span>
                            <span class="flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}">Total cost: $${employee.data["total_cost"] > 1000000000 ? (Math.round((employee.data["total_cost"] + Number.EPSILON) / 1000000000 * 100) / 100) + "B" :employee.data["total_cost"] > 1000000 ? (Math.round((employee.data["total_cost"] + Number.EPSILON) / 1000000 * 100) / 100) + "M" : (Math.round((employee.data["total_cost"] / 1000 + Number.EPSILON) * 100) / 100) + "K"}</span>
                            <span class="flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}">Management cost ratio: ${Math.round((employee.data["management_cost_ratio"] + Number.EPSILON) * 100) / 100}</span>
                            <div class="flex flex-row px-2 py-0.5 gap-x-1 rounded-2xl m-auto ${background_text}">
<!--                                <svg class="h-3 w-3 m-auto" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.37892 10.2236L8 16L12.6211 10.2236C13.5137 9.10788 14 7.72154 14 6.29266V6C14 2.68629 11.3137 0 8 0C4.68629 0 2 2.68629 2 6V6.29266C2 7.72154 2.4863 9.10788 3.37892 10.2236ZM8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" fill="#000000"></path> </g></svg>-->
                                <span class="flex text-center">${employee.data["Location"]}</span>
                            </div>
                        </div>
                        <div v-if="${employee._children !== null && employee._children.length > 0}" class="bg-slate-700 rounded-3xl text-white w-fit px-2 py-0.5 m-auto">
                            <span class="text-center">${employee._children.length}/${employee.data["descendant_count"]}</span>
                        </div>
                    </div>
                </foreignObject>`;
}