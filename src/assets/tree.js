import * as d3 from "d3";

export const create_graph_at_element_id = (root_id, raw_json) => {

    // Specify the charts’ dimensions. The height is variable, depending on the layout.
    const marginLeft = 10;
    const marginBottom = 10;
    const marginRight = 10;
    const marginTop = 40;

    // Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
    // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
    // “bottom”, in the data domain. The width of a column is based on the tree’s height.
    const root = d3.stratify()
        .id((d) => d["Employee Id"])
        .parentId((d) => d["Manager"])
        (raw_json);

    // this is the size of each individual node
    const dx = 240;
    const dy = 320;

    // Define the tree layout and the shape for links.
    const tree = d3.tree().nodeSize([dx, dy]);
    // create vertical paths from parents to children
    const diagonal = d3.linkVertical().y(d => d.y).x(d => d.x);

    // Create the SVG container, a layer for the links and a layer for the nodes. Set initialize size to the size of 1 node
    const svg = d3.select(root_id)
        .append("svg")
        .attr("width", dx)
        .attr("height", dy)
        .attr("viewBox", [0, 0, dx, dy]);

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

    // run every time we want to update tree state
    function update(event, source) {

        const duration = 250; // hold the alt key to slow down the transition
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

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
        const height = bottom.y - top.y + marginTop + marginBottom;
        // height is the horizontal difference between right most and left most nodes plus their added margins, essentially giving the width of our tree
        const width = right.x - left.x + marginLeft + marginRight;

        const transition = svg.transition()
            .duration(duration)
            .attr("height", height)
            .attr("width", width)
            .attr("viewBox", [0, 0, width, height])
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
            });


        // sets the color of the node circle
        nodeEnter.append("circle")
            .attr("r", 5.5)
            .attr("fill", d => d._children ? "#555" : "#999");

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
    root.x0 = dx / 2;
    root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        if (d.depth) d.children = null;
    });

    // collapse(root)
    update(null, root);

    return svg.node();

}