
function Panorama() {

	this.PSV = null

	this.init = function() {
		this.PSV = new PhotoSphereViewer({
			container: 'container',
			panorama: '/pano/images/BJ01.jpg'
		});
	}

	this.toggleAutorotate = function() {
		this.PSV.toggleAutorotate()
	}
}

var panorama

window.onload = function() {
	
	panorama = new Panorama();
	panorama.init();

	var socket = io.connect("ws://172.20.10.11:4000");
	socket.on('toggleAutorotate', function (data) {
		console.log(data)
		panorama.toggleAutorotate();
	});

}
