import * as d3 from 'd3';

interface Graph {
    nodes: [
        { label: string }
    ],
    edges: [
        {
            source: number,
            target: number
        }
    ]
}

interface D3Graph {
    name: string,
    children: D3Graph[]
}

export function drawGraphFromUri(graphUri: string) {
    const diameter = 1000;
    const tree = createTree(diameter);
    const diagonal = createDiagonal();
    const drawingArea = createDrawingArea(diameter);

    d3.select(self.frameElement).style('height', diameter - 150 + 'px');

    d3.json(graphUri, (error, root) => {
        if (error) throw error;

        root = transformData(root);

        const nodes = tree.nodes(root),
            links = tree.links(nodes);

        drawLinks(drawingArea, diagonal, links);
        drawNodes(drawingArea, nodes);
    });
}

function createTree(diameter: number) {
    return d3.layout.tree()
        .size([360, diameter / 2 - 200])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
}

function createDiagonal() {
    return d3.svg.diagonal.radial().projection(d => [d.y, d.x / 180 * Math.PI]);
}

function createDrawingArea(diameter: number) {
    return d3.select('body').append('svg')
        .attr('width', diameter)
        .attr('height', diameter)
        .append('g')
        .attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')');
}

function drawNodes(drawingArea: d3.Selection<any>, nodes: d3.layout.tree.Node[]) {
    const drawingNodes = createDrawingNodes(drawingArea, nodes);
    drawNodePoints(drawingNodes);
    drawNodeLabels(drawingNodes);
}

function createDrawingNodes(drawingArea: d3.Selection<any>, nodes: d3.layout.tree.Node[]) {
    return drawingArea.selectAll('.node')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', node => 'rotate(' + (node.x - 90) + ') translate(' + node.y + ')');
}

function drawNodePoints(drawingNodes: d3.Selection<d3.layout.tree.Node>) {
    drawingNodes.append('circle')
        .attr('r', 4.5);
}

function drawNodeLabels(drawingNodes: d3.Selection<d3.layout.tree.Node>) {
    drawingNodes.append('text')
        .attr('dy', '.31em')
        .attr('text-anchor', node => node.x < 180 ? 'start' : 'end')
        .attr('transform', node => node.x < 180 ? 'translate(8)' : 'rotate(180) translate(-8)')
        .text(d => (d as any).name);
}

function drawLinks(drawingArea: d3.Selection<any>, diagonal: d3.svg.diagonal.Radial<d3.svg.diagonal.Link<d3.svg.diagonal.Node>, d3.svg.diagonal.Node>, links: d3.layout.tree.Link<d3.layout.tree.Node>[]) {
    drawingArea.selectAll('.link')
        .data(links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', diagonal);
}

function transformData(data: Graph) {
    const transformed: D3Graph = {
        name: 'root',
        children: data.nodes.map((node) => {
            return {
                name: node.label,
                children: []
            };
        })
    };

    for (const edge of data.edges) {
        transformed.children[edge.source].children.push({
            name: transformed.children[edge.target].name,
            children: []
        });
    }

    return transformed;
}