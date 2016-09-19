(() => {
    'use strict';

    const randomGraph = require('randomGraph');

    const express = require('express');
    const app = express();

    app.get('/data/graph', (request, response) => response.send(buildGraph()));

    app.use(express.static('dist/'));

    app.listen(3000, () => {    
        console.log('listening on 3000');
    });

    function buildGraph() {
        const numNodes = getWholeRandom(30),
            chanceOfEdge = Math.random() / 10;
        
        console.log('generating graph with', numNodes, 'nodes', 'and', chanceOfEdge, 'chance');
        return randomGraph.ErdosRenyi.np(numNodes, chanceOfEdge);
    }

    function getWholeRandom(max) {
        return Math.floor((Math.random() * max) + 1);
    }
})();