# LunchTyme

Dependancies:
	node.js
	create-react-app
	google-maps-react


This is a basic React Example.


I tried using ReactDrawer, but when imported, there's a ton of 
compile errors. It's possible it doesn't work due to version
differences. For now it uses css3 animations.


I made an attempt at using react-controllables to center the map 
on a pin click. Maybe there's something I'm not understanding about 
it, because it just wasn't working.


google-map-react is having issues with mobile devices. For some reason, 
it will appear momentarily and then disappear. I tried playing around
with various css properties, as it seems the common knowledge of what
causes the google maps api to crash, is usually css issues. But 
unfortunately, I could not find the magic set of properties to change
to make it work. So for now the map has issues on mobile browsers.