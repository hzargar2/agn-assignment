<script setup>

import {onMounted} from "vue";
import * as d3 from "d3";
import {createApp} from "vue";
import Employee from "@/components/Employee.vue";


let props = defineProps({
    employees_json: {
        type: Object,
        required: true
    },
    graph_dom_id: {
        type: String,
        required: true
    }
})


onMounted(() => {

    // Specify the charts’ dimensions. The height is variable, depending on the layout.
    const marginTop = 40;
    const horizontal_separation_factor_for_same_parent = 1.1
    const horizontal_separation_factor_for_different_parent = 1.5
    const vertical_separation_of_levels_in_px = 400
    const shadow_px_room_for_each_node = 10;

    // Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
    // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
    // “bottom”, in the data domain. The width of a column is based on the tree’s height.
    const root = d3.stratify()
        .id((node) => node["Employee Id"])
        .parentId((node) => node["Manager"])
        (props.employees_json);

    // this is the size of each individual node
    const dx = 240 + shadow_px_room_for_each_node;
    const dy = 320 + shadow_px_room_for_each_node;

    // Define the tree layout and the shape for links.
    const tree = d3.tree().nodeSize([dx, dy])
        .separation(function(a, b) { return (a.parent == b.parent ? horizontal_separation_factor_for_same_parent : horizontal_separation_factor_for_different_parent); });
    // create vertical paths from parents to children
    const diagonal = d3.linkVertical().y(node => node.y).x(node => node.x);

    // svg takes height and width of parent when not specified. See element for the tree id. Also setthe view box to the
    // entire screen and shift it on the x-axis by negative width/2 so the root node ends up in the center.
    // Create the SVG container, a layer for the links and a layer for the nodes. Set initialize size to the size of 1 node
    const svg = d3.select("#" + props.graph_dom_id)
        .append("svg")
        .attr("viewBox", [-window.screen.width/2, -marginTop, window.screen.width, window.screen.height])
        .attr("pointer-events", "all");

    const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

    // apply transformations on zoom and drag, for some reason also works with drag
    const zoomBehaviours = d3.zoom()
        .scaleExtent([0.2, 1.5])
        .on('zoom', function (event){
            gNode.attr('transform', event.transform);
            gLink.attr('transform', event.transform);
    });

    // add zoom and drag behavior to element
    svg.call(zoomBehaviours);

    // Collapse the node and all it's children
    function collapse(node) {
        if (node.children) {
            node._children = node.children;
            node._children.forEach(collapse);
            node.children = null;
        }
    }

    // function diagonal(node, i) {
    //     return     "M" + (node.source.x) + "," + (node.source.y)
    //         + "V" + (((node.source.y + dy) + (node.target.y + dy))/7)
    //         + "H" + (node.target.x)
    //         + "V" + (node.target.y);
    // };


    // run every time we want to update tree state
    function update(event, source) {

        const duration = 250; // hold the alt key to slow down the transition
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        // Normalize for fixed-depth.
        nodes.forEach(function(node) {
            node.y = node.depth * vertical_separation_of_levels_in_px;
        });

        const transition = svg.transition()
            .duration(duration)
            .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

        // Update the nodes…
        const node = gNode.selectAll("g")
            .data(nodes, node => node.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
            .attr("transform", node => `translate(${source.x0},${source.y0})`)
            .classed("group", true) // triggers on hover styling in Employee component, useful since want to change styling even if the node is hovered on since the shadow is part of the node, can't put shadow outside node
            .on("click", (event, node) => {

                node.children = node.children ? null : node._children;

                // if the nodes children are null, ie we have clicked to close the card then we need to also collapse
                // of the descendant children of this node recursively so that when we reopen it only opens 1 level
                // is opened and not all the previous levels that existed prior to the close.
                if (!node.children){
                    node._children.forEach((node) => collapse(node));
                }

                update(event, node);

            });

        // create an Employee component and add the rendered html to the node
        nodeEnter.html((node) => {
            // console.log(node)
            let elm = document.createElement('foreignObject');
            elm.setAttribute("x", -dx/2);
            elm.setAttribute("y", 0);
            elm.setAttribute("width", dx);
            elm.setAttribute("height", dy);

            createApp(Employee, {employee: node}).mount(elm);
            // console.log(elm.outerHTML)
            return elm.outerHTML;
        });

        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
            .attr("transform", node => `translate(${node.x},${node.y})`)
            .attr("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition(transition).remove()
            .attr("transform", node => `translate(${source.x},${source.y})`)
            .attr("fill-opacity", 0);

        // Update the links…
        const link = gLink.selectAll("path")
            .data(links, node => node.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append("path")
            .attr("d", node => {
            // d3.linkVertical().y((d) => (d.y === d.source.y0 ? d.y + 100 : d.y)).x((d) => d.x)(node);
                const o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
            .attr("d", node => {
                const o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            });

        // Stash the old positions for transition.
        root.eachBefore(node => {
            node.x0 = node.x;
            node.y0 = node.y;
        });
    }

    // Do the first update to the initial configuration of the tree — where a number of nodes
    // are open (arbitrarily selected as the root, plus nodes with 7 letters).
    root.y0 = dy / 2;
    root.x0 = 0;
    root.descendants().forEach((node, i) => {
        node.id = i;
        node._children = node.children;
        if (node.depth) node.children = null;
    });

    collapse(root)
    update(null, root);
})

</script>

<template>
  <div v-bind:id="props.graph_dom_id" class="w-screen h-screen"></div>
</template>
