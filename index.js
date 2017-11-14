/*
	requirements:
	google-maps-react
*/
import React from 'react';
import ReactDOM from 'react-dom';

import "./css/index.css";

import GoogleMap from 'google-map-react';

/*
	List View
*/
class RestaurantList extends React.Component {
	constructor(props){
		super(props);
		this.selected = -1;
		this.selectedData = null;
		this.state = { data:[], width: '0', height: '0', drawer:'drawerClosed' };
		this.windowResize = this.windowResize.bind(this);
	}

	componentWillUnmount(){
		//this.removeEventListener('resize');
	}

	componentDidMount(){
		this.windowResize();
		window.addEventListener( 'resize', this.windowResize );
		this.loadData();
	}	

	windowResize (){
		this.setState({width:window.innerWidth,height:window.innerHeight});
	}

	select( i ){
		this.selected = i;
		this.selectedData = this.state.data[i];

		var cData = this.state.data;
		for ( var n = 0; n < cData.length; n++ ){
			cData[n].selected="";
		}
		cData[i].selected = "selected";
		this.setState( { data:cData } );
	}

	openLocation(){
		if ( this.selected > -1 ){
			this.setState( { drawer: "drawerOpened" } );
		}
	}

	Header(){
		return (
			<div className="Header">
				<span className="headerCaption">Lunch Tyme</span>
				<img src={ require('./img/icon_map@2x.png')} className="mapIcon" onClick = { () => this.openLocation() } alt="map"/>
			</div>
		);			

	}

	Restaurant( item, i ){
		return (
			<li className={item.selected + " restaurant"} onClick={ () => this.select(i) }>
				<span className="crutch"></span>
				<img src={ item.backgroundImageURL } className={item.selected + " restaurantBGImg"} alt={item.name}/>
				<img src={ require('./img/cellGradientBackground@2x.png') } className="restaurantoverlayImg" alt=""/>
				
				<span className="restaurantOverlay">{item.name}</span>
				<span className="categoryOverlay">{item.category}</span>
			</li>
		);
	}


	loadData(){
		var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    	var targetUrl = 'http://s3.amazonaws.com/br-codingexams/restaurants.json';
    	var self = this;

		fetch( proxyUrl + targetUrl )
		.then( response => response.json() )
		.then( 
			function (data){
				for ( var n = 0; n < data.length; n++ ){
					data[n].selected="";
				}
				self.setState( { data:data.restaurants } )
			}
		)
		.catch( err => console.error( "Could not parse JSON", this.props.url, err.toString() ) );
	}

	render(){
		var className = ( this.state.width > 800 ) ? "list hres" : "list";
		return (
			<div>
				{this.Header()}				
				<ul className={className}>
					{ 
						this.state.data.map( ( item, i ) => {
							return this.Restaurant( item, i );
						})
					}
				</ul>
				<MapView className={this.state.drawer} data={this.state.data} item={this.selectedData} parent={this}/>
			</div>
		);
	}
}



class Pin extends React.Component {
	static defaultProps = {
		pintype : "pin",
	}
	constructor( props ){
		super(props);
	}

	select( i ){
		var map = this.props.parent;
		var mapView = map.props.parent;
		var restaurantList = mapView.props.parent;
		restaurantList.select(i);
	}

	render(){
		if ( this.props.item.location ){
			var lat = this.props.item.location.lat;
			var lng = this.props.item.location.lng;
			return (
		        <div
		        	className="pinPoint"
					lat={lat}
					lng={lng}
					onClick={ () => this.select(this.props.index) }
		        >
			        <span className={this.props.pintype}></span>
			        <span className="title">
			        	{this.props.item.name}
			        </span>

			    </div>			
			);
		} else {
			return null;
		}
	}
}



class Map extends React.Component {
	static defaultProps = {
		center: [ 0, 0 ],
		zoom: 17
	};

	constructor( props ){
		props.center[0] = props.lat;
		props.center[1] = props.lng;
		super(props);
	}

	getOptions(map){
		return {
			mapTypeControl:true,
		}
	}

	createPin(item, i){
		var pintype = "pin";
		if ( item.selected ){
			pintype = "pinSelected";
		}
		if ( item.location ){
			//The lat/lng need to be here in order for the pin to function correctly.
			return (
				<Pin 
					item = {item}
					lat = {item.location.lat}
					lng = {item.location.lng}
					index = {i}
					pintype = {pintype}
					parent = {this}
				/>
			); //
		} else {
			return null;
		}
	}

	render(){
		var data = this.props.data;
		if ( this.props.item.location ){
			this.props.center[0] = this.props.item.location.lat;
			this.props.center[1] = this.props.item.location.lng;
		}

		//GoogleMap.setCenter 
		return (
			<div className="Map">
				<GoogleMap
		        	defaultCenter = {this.props.center}
		        	defaultZoom = {this.props.zoom}
		      		center = {this.props.center}
		      		options = {this.getOptions}
				>
					{ data.map( ( item, i ) => {
							return this.createPin( item, i );
					} ) }
		      	</GoogleMap>
		    </div>
		);
	}
}


class MapView extends React.Component {
	constructor( props ){
		super(props);
	}
	back(){
		this.props.parent.setState({drawer:"drawerClosed"})
	}
	Header(){
		return (
			<div className="mapViewHeader">
				<span className="headerCaption">Lunch Tyme</span>
				<img src={ require('./img/ic_webBack@2x.png')} className="backIcon" onClick= { () => this.back() }  alt="back"/>
			</div>
		);			

	}
	render(){
		var address = null;
		var address2 = null;
		var name = null;
		var category = null;
		var map = null;
		var phone = null;
		var twitter = null;

		if ( this.props.item ){
			name = <span className="line name">{this.props.item.name}</span>;
			category = <span className="line category">{this.props.item.category}</span>;

			if ( this.props.item.contact ){
				if ( this.props.item.contact.formattedPhone ){
					phone = <span className="line phone">{this.props.item.contact.formattedPhone}</span>;
				} else {
					phone = <span className="line phone">{this.props.item.contact.phone}</span>;
				}
				if ( this.props.item.contact.twitter ) {
					twitter = <span className="line twitter">@{this.props.item.contact.twitter}</span>
				}
			}

			if ( this.props.item.location ){
				address = <span className="line address">{this.props.item.location.address}</span>
				address2 = <span className="line address2">{this.props.item.location.city}, {this.props.item.location.state} {this.props.item.location.postalCode}</span>
					
				map = (
					<Map 
						parent={this}
						data={this.props.data}
						item={this.props.item}
					/>
				);//
			}
		}

		return(
			<div className={this.props.className}>
				{this.Header()}
				{map}
				<div className="rTitle">
					{name}
					{category}
				</div>
				<div className="rDesc">
					{address}
					{address2}
					{phone}
					{twitter}
				</div>
			</div>
		)
	}
}



ReactDOM.render( <RestaurantList/>, document.getElementById("root") );
