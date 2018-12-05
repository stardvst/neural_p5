var dropdown;

function Node(value, x, y) {
	this.value = value;
	this.edges = [];
	this.searched = false;
	this.parent = null;

	this.x = x;
	this.y = y;
}

Node.prototype.addEdge = function (neightbor) {
	this.edges.push(neightbor);
	neightbor.edges.push(this);

	// draw connection
	stroke(100);
	line(this.x, this.y, neightbor.x, neightbor.y);
};

Node.prototype.draw = function (type) {
	var circleColor = type == 1 ? 244 : 10;
	var textColor = type == 1 ? 10 : 244;

	// draw a circle
	fill(circleColor, 130, 100);
	stroke(50);
	ellipse(this.x, this.y, 100, 30);

	// text
	noStroke();
	fill(textColor, 130, 100);
	text(this.value, this.x - 30, this.y);
}

function Graph() {
	this.nodes = [];
	this.graph = {};

	this.start = null;
	this.end = null;
}

Graph.prototype.addNode = function (node, type) {
	// Node into array
	this.nodes.push(node);
	// Node into "hash"
	var title = node.value;
	this.graph[title] = node;

	// draw a circle
	fill(70);
	stroke(50);
	ellipse(node.x, node.y, 100, 30);

	// text
	noStroke();
	fill(type == 1 ? 255 : 150, 130, 100);
	text(node.value, node.x - 30, node.y);
};

Graph.prototype.getNode = function (node) {
	var found = this.graph[node];
	return found ? found : null;
};

Graph.prototype.setStart = function (actor) {
	this.start = this.graph[actor];
	return this.start;
};

Graph.prototype.setEnd = function (actor) {
	this.end = this.graph[actor];
	return this.end;
};

Graph.prototype.reset = function () {
	for (var i = 0; i < this.nodes.length; ++i) {
		this.nodes[i].searched = false;
		this.nodes[i].parent = null;
	}
};

function preload() {
	data = loadJSON('https://raw.githubusercontent.com/shiffman/NOC-S17-2-Intelligence-Learning/master/week1-graphs/P2_six_degrees_kevin_bacon/bacon.json');
}

function setup() {
	createCanvas(1200, 800);
	dropdown = createSelect();
	dropdown.changed(bfs);

	graph = new Graph();

	var movies = data.movies;
	for (var i = 0; i < movies.length; ++i) {
		var movie = movies[i].title;
		var cast = movies[i].cast;
		var movieNode = new Node(movie, floor(random(0, width - 50)), floor(random(0, height - 50)));
		graph.addNode(movieNode, 1);

		for (var j = 0; j < cast.length; ++j) {
			var actor = cast[j];
			var actorNode = graph.getNode(actor);
			if (!actorNode) {
				actorNode = new Node(actor, floor(random(0, width - 50)), floor(random(0, height - 50)));
				dropdown.option(actor);
			}
			graph.addNode(actorNode, 2);
			movieNode.addEdge(actorNode);
		}
	}

}

function bfs() {
	graph.reset();

	var start = graph.setStart(dropdown.value());
	var end = graph.setEnd("Kevin Bacon");

	// mark start and end nodes
	start.draw(1);
	end.draw(2);

	var queue = [];

	start.searched = true;
	queue.push(start);

	while (queue.length) {
		var current = queue.shift();
		if (current == end) {
			console.log("Found " + current.value);
			break;
		}

		var edges = current.edges;
		for (var i = 0; i < edges.length; ++i) {
			var neighbor = edges[i];
			if (!neighbor.searched) {
				neighbor.searched = true;
				neighbor.parent = current;
				queue.push(neighbor);
			}
		}
	}

	var path = [];
	path.push(end);
	var next = end.parent;
	while (next) {
		path.push(next);
		next = next.parent;
	}

	var txt = '';
	for (i = path.length - 1; i >= 0; --i) {
		var node = path[i];
		txt += node.value;
		if (i != 0) {
			txt += ' --> ';
		}
	}
	createP(txt);
}
