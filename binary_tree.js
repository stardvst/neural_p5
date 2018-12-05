var tree;

function setup() {
	clear();
	createCanvas(800, 600);
	background(51);

	tree = new Tree();

	for (var i = 0; i < 20; ++i) {
		tree.addValue(floor(random(0, 1000)));
	}

	tree.traverse();
}

function Node(val, x, y) {
	this.value = val;
	this.left = null;
	this.right = null;
	this.x = x;
	this.y = y;
	this.distance = 2;
}

Node.prototype.addNode = function (node) {
	if (node.value < this.value) {
		if (this.left == null) {
			this.left = node;
			this.left.x = this.x - (width / pow(2, node.distance));
			this.left.y = this.y + (height / 12);
		}
		else {
			++node.distance;
			this.left.addNode(node);
		}
	}
	else if (node.value > this.value) {
		if (this.right == null) {
			this.right = node;
			this.right.x = this.x + (width / pow(2, node.distance));
			this.right.y = this.y + (height / 12);
		}
		else {
			++node.distance;
			this.right.addNode(node);
		}
	}
};

Node.prototype.visit = function (parent) {
	if (this.left) {
		this.left.visit(this);
	}
	console.log(this.value);

	// draw a line
	stroke(100);
	line(parent.x, parent.y, this.x, this.y);

	// draw a circle
	stroke(200);
	fill(0);
	ellipse(this.x, this.y, 24, 24);
	noStroke();

	// display the value
	fill(255);
	textAlign(CENTER);
	textSize(12);
	text(this.value, this.x, this.y + 4);

	if (this.right) {
		this.right.visit(this);
	}
};

Node.prototype.search = function (val) {
	if (this.value == val) {
		return this;
	}
	if (val < this.value && this.left) {
		return this.left.search(val);
	}
	if (val > this.value && this.right) {
		return this.right.search(val);
	}
	return null;
};

function Tree() {
	this.root = null;
}

Tree.prototype.addValue = function (val) {
	var node = new Node(val);
	if (this.root == null) {
		this.root = node;
		this.root.x = width / 2;
		this.root.y = 16;
	}
	else {
		this.root.addNode(node);
	}
};

Tree.prototype.traverse = function () {
	this.root.visit(this.root);
};

Tree.prototype.search = function (val) {
	var found = this.root.search(val);
	return found;
};

function draw() {

}