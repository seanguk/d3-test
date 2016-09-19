import * as d3 from 'd3';

const diameter = 1000;

const tree = d3.layout.tree()
    .size([360, diameter / 2 - 120])
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

const diagonal = d3.svg.diagonal.radial()
    .projection(d => [d.y, d.x / 180 * Math.PI]);

const svg = d3.select('body').append('svg')
    .attr('width', diameter)
    .attr('height', diameter - 150)
    .append('g')
    .attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')');

d3.json('data/flare.json', function(error, root) {
  if (error) throw error;

  const nodes = tree.nodes(root),
      links = tree.links(nodes);

  const link = svg.selectAll('.link')
      .data(links)
    .enter().append('path')
      .attr('class', 'link')
      .attr('d', diagonal);

  const node = svg.selectAll('.node')
      .data(nodes)
    .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => 'rotate(' + (d.x - 90) + ') translate(' + d.y + ')');

  node.append('circle')
      .attr('r', 4.5);

  node.append('text')
      .attr('dy', '.31em')
      .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
      .attr('transform', d => d.x < 180 ? 'translate(8)' : 'rotate(180) translate(-8)')
      .text(d => (d as any).name);
});

d3.select(self.frameElement).style("height", diameter - 150 + "px");