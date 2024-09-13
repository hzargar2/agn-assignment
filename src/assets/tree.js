import * as d3 from "d3";

export const create_graph_at_element_id = (root_id, raw_json) => {

    // Specify the charts’ dimensions. The height is variable, depending on the layout.
    const marginLeft = 10;
    const marginBottom = 10;
    const marginRight = 10;
    const marginTop = 40;
    const radius = 5.5;

    // Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
    // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
    // “bottom”, in the data domain. The width of a column is based on the tree’s height.
    const root = d3.stratify()
        .id((d) => d["Employee Id"])
        .parentId((d) => d["Manager"])
        (raw_json);

    // this is the size of each individual node
    const dx = 240;
    const dy = 340;

    // Define the tree layout and the shape for links.
    const tree = d3.tree().nodeSize([dx, dy])
        .separation(function(a, b) { return (a.parent == b.parent ? 1.1 : 1.5); });
    // create vertical paths from parents to children
    const diagonal = d3.linkVertical().y(d => d.y).x(d => d.x);

    // Create the SVG container, a layer for the links and a layer for the nodes. Set initialize size to the size of 1 node
    const svg = d3.select(root_id)
        .append("svg")
        .attr("width", dx)
        .attr("height", dy)
        .attr("viewBox", [0, 0, dx + marginLeft + marginRight, dy + marginTop + marginBottom])
        .attr("style", "min-width: 100%;");

    const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

    // Collapse the node and all it's children
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    // function diagonal(d, i) {
    //     return     "M" + (d.source.x) + "," + (d.source.y)
    //         + "V" + (((d.source.y + dy) + (d.target.y + dy))/7)
    //         + "H" + (d.target.x)
    //         + "V" + (d.target.y);
    // };


    function dragstarted(event, d) {
        d3.select(this).raise().attr("stroke", "black");
    }

    function dragged(event, d) {
        d.x = event.x;
        d.y = event.y;
        d3.select(this).attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    function dragended(event, d) {
        d3.select(this).attr("stroke", null);
    }

    let drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

    // run every time we want to update tree state
    function update(event, source) {

        const duration = 250; // hold the alt key to slow down the transition
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) {
            d.y = d.depth * 400;
        });

        // find the top most node, the bottom most node, the most right node, and the most left node
        let top = root;
        let bottom = root;
        let left = root;
        let right = root;
        root.eachBefore(node => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
            if (node.y < top.y) top = node;
            if (node.y > bottom.y) bottom = node;
        });

        // height is the difference between top most and bottom most nodes plus their added margins, essentially giving the height of our tree
        let height = bottom.y - top.y + marginTop + marginBottom + dy;
        // height is the horizontal difference between right most and left most nodes plus their added margins, essentially giving the width of our tree
        let width = right.x - left.x + marginLeft + marginRight + dx;

        console.log(right.x, left.x, right.x - left.x)
        console.log(width)

        const transition = svg.transition()
            .duration(duration)
            .attr("width", d3.max([width, dx]))
            .attr("height",  d3.max([height, dy]))
            .attr("viewBox", [-d3.max([width, dx])/2, -marginTop, d3.max([width, dx]), d3.max([height, dy])])
            .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

        // Update the nodes…
        const node = gNode.selectAll("g")
            .data(nodes, d => d.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
            .attr("transform", d => `translate(${source.x0},${source.y0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", (event, d) => {
                d.children = d.children ? null : d._children;
                update(event, d);
            })
            .call(drag);

        nodeEnter.html((d) => {

            let background_color;
            let background_text;

            if (d.data["Department"].toLowerCase().includes("operations")){
                background_color = "bg-lime-50 hover:bg-lime-100";
                background_text = "bg-lime-200";
            }else if (d.data["Department"].toLowerCase().includes("sales")) {
                background_color = "bg-emerald-50 hover:bg-emerald-100";
                background_text = "bg-emerald-200";
            }else if (d.data["Department"].toLowerCase().includes("data analytics")) {
                background_color = "bg-teal-50 hover:bg-teal-100";
                background_text = "bg-teal-200";
            }
            else if (d.data["Department"].toLowerCase().includes("customer support")) {
                background_color = "bg-cyan-50 hover:bg-cyan-100";
                background_text = "bg-cyan-200";
            }
            else if (d.data["Department"].toLowerCase().includes("system")) {
                background_color = "bg-indigo-50 hover:bg-indigo-100";
                background_text = "bg-indigo-200";
            }
            else if (d.data["Department"].toLowerCase().includes("project")) {
                background_color = "bg-purple-50 hover:bg-purple-100";
                background_text = "bg-purple-200";
            }
            else if (d.data["Department"].toLowerCase().includes("human resources")) {
                background_color = "bg-rose-50 hover:bg-rose-100";
                background_text = "bg-rose-200";
            }
            else if (d.data["Department"].toLowerCase().includes("software")) {
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
                            <span class="flex font-medium mx-auto">${d.data["Name"]} ${d.data["Employee Id"]}</span>
                            <span class="flex text-center mx-auto text-gray-600 ${background_text}">${d.data["Job Title"]}</span>
                        </div>
                        
                        <div class="flex flex-col gap-1 mb-0 m-auto text-sm">
                            <!--                Calculate numeric values for styling inline-->
                            <span class="flex text-center px-2 py-0.5 rounded-2xl m-auto border-2 border-gray-800 border-opacity-60 ${background_text}">${d.data["Department"]}</span>
                            <span class="flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}">Level ${d.data["level"]}</span>
                            <span class="flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}">Management cost: ${d.data["management_cost"] > 1000000 ? (Math.round((d.data["management_cost"] + Number.EPSILON) / 1000000 * 100) / 100) + "M" : (Math.round((d.data["management_cost"] / 1000 + Number.EPSILON) * 100) / 100) + "K"}</span>
                            <span class="flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}">IC cost: ${d.data["ic_cost"] > 1000000 ? (Math.round((d.data["ic_cost"] + Number.EPSILON) / 1000000 * 100) / 100) + "M" : (Math.round((d.data["ic_cost"] / 1000 + Number.EPSILON) * 100) / 100) + "K"}</span>
                            <span class="flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}">Total cost: ${d.data["total_cost"] > 1000000 ? (Math.round((d.data["total_cost"] + Number.EPSILON) / 1000000 * 100) / 100) + "M" : (Math.round((d.data["total_cost"] / 1000 + Number.EPSILON) * 100) / 100) + "K"}</span>
                            <span class="flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}">Management cost ratio: ${Math.round((d.data["management_cost_ratio"] + Number.EPSILON) * 100) / 100}</span>
                            <div class="flex flex-row px-2 py-0.5 gap-x-1 rounded-2xl m-auto ${background_text}">
                                <svg class="h-3 w-3 m-auto" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.37892 10.2236L8 16L12.6211 10.2236C13.5137 9.10788 14 7.72154 14 6.29266V6C14 2.68629 11.3137 0 8 0C4.68629 0 2 2.68629 2 6V6.29266C2 7.72154 2.4863 9.10788 3.37892 10.2236ZM8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" fill="#000000"></path> </g></svg>
                                <span class="flex text-center">${d.data["Location"]}</span>
                            </div>
                        </div>
                    </div>
                </foreignObject>`;
        });

        // // sets the color of the node circle
        // nodeEnter.append("circle")
        //     .attr("r", 5.5)
        //     .attr("fill", d => d._children ? "#555" : "#999");

        // sets the text beside the nodes
        nodeEnter.append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d._children ? -8 : 8)
            .attr("text-anchor", d => d._children ? "end" : "start")
            .text(d => d.data["Employee Id"]);

        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
            .attr("transform", d => `translate(${d.x},${d.y})`)
            .attr("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition(transition).remove()
            .attr("transform", d => `translate(${source.x},${source.y})`)
            .attr("fill-opacity", 0);

        // Update the links…
        const link = gLink.selectAll("path")
            .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append("path")
            .attr("d", d => {
                const o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
            .attr("d", d => {
                const o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            });

        // Stash the old positions for transition.
        root.eachBefore(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Do the first update to the initial configuration of the tree — where a number of nodes
    // are open (arbitrarily selected as the root, plus nodes with 7 letters).
    root.y0 = dy / 2;
    root.x0 = 0;
    root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        if (d.depth) d.children = null;
    });

    // collapse(root)
    update(null, root);

    return svg.node();

}