import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import {geosearch} from 'esri-leaflet-geocoder';
import './LocationMap.css';
import useSwr from 'swr';
import 'leaflet/dist/leaflet.css';
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css';
import LeafletControlGeocoder from './LeafletControlGeocoder';
import { useDispatch, useSelector} from 'react-redux';
import { getCoords, getPosts } from '../../redux/actions';
import huella  from "../../assets/map/huellitasLost.png";
import huellaAdopt  from "../../assets/map/huellitaAdoption.png";
import signodeex  from "../../assets/map/huellitasFounded.png";
import {Icon} from "leaflet"
import { typeState } from '../../redux/reducers/index';
import { Link } from 'react-router-dom';
import L from 'leaflet';

let defaultCenter = [-34.6038, -58.3816];
let defaultZoom = 13;

////////////////////////////localizacion//////////////////////////////////////////
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  var crd = pos.coords;
  defaultCenter = [crd.latitude, crd.longitude];
}
function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

navigator.geolocation.getCurrentPosition(success, error, options);

//////////////////////////////////////////////////////////////////////////////////

function DisplayPosition({ map }) {
  const [position, setPosition] = useState(map.getCenter());
  const dispatch = useDispatch();

  const onMove = useCallback(() => {
    setPosition(map.getCenter());
  }, [map]);

  useEffect(() => {
    map.on('move', onMove);
    return () => {
      map.off('move', onMove);
      dispatch(getCoords(position.lat.toString(), position.lng.toString()));
    };
  }, [map, onMove, position, dispatch]);
  
  return (
    <>
      {/* latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}
      <button onClick={onClick}>reset</button> */}
    </>
  );
}

export default function LocationMap({originPost}) {

  const icon = useMemo(() => {
    return new Icon({
    iconUrl: huella,
    iconSize: [25, 25]
  });
  },[]);
 
  const icon2 = useMemo(()=>{
    return new Icon({
    iconUrl: huellaAdopt,
    iconSize: [30, 30]
  });
  },[]) ;

  const icon3 = useMemo(()=>{
    return new Icon({
    iconUrl: signodeex,
    iconSize: [25, 25]
  });
  },[]) ;
  
  const fetcher = (...args) => fetch(...args).then(response => response.json());
  const [map, setMap] = useState(null);
  const dispatch = useDispatch();
  let allPosts = useSelector((state) => state.filteredPosts);

  //https://huellitaspg.herokuapp.com/post
  // const url = 'https://huellitaspg.herokuapp.com/post';
  // const { data, error } = useSwr(url, fetcher);

  // var marker = L.marker(defaultCenter, { icon }).addTo(map);
  // marker.fire('click');

  useEffect(() => {
    dispatch(getPosts())
  }, [dispatch]);

  const displayMap = useMemo(() => {
    const posts = allPosts ? allPosts : [];
    return (
      
      <MapContainer
        className='mapContainer'
        center={defaultCenter} 
        zoom={defaultZoom}
        scrollWheelZoom={false}
        whenCreated={setMap}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {/* <Marker position={} icon={icon}></Marker>   */}
        {posts.map(post => (
          post.state === 'Perdido' ? 
          <Marker 
            key={post._id}
            
            position={[post.latitude? post.latitude : '', post.longitude? post.longitude : '']} 
            
            icon={icon}
            >
            <Popup> 
              <div style = {{width: '200px'}}>
                {post.name? <Link to = {`/home/detail/${post._id}`}><h1>{`Nombre: ${post.name}`}</h1></Link> : ""}
                <Link to = {`/home/detail/${post._id}`}><img style = {{width: '200px'}} src = {post.petImage.url} alt=""></img></Link>
                <h3>{`Estado: ${post.state}`}</h3>
                <h3>{`Tipo: ${post.type}`}</h3>
                <h3>{`Genero: ${post.genre}`}</h3> 
              </div>
            </Popup>
          </Marker>
          : post.state === 'Encontrado' ? 
          <Marker 
            key={post._id}
            
            position={[post.latitude? post.latitude : '', post.longitude? post.longitude : '']} 
            
            icon={icon3}
            >
            <Popup> 
              <div style = {{width: '200px'}}>
                {post.name? <h1>{`Nombre: ${post.name}`}</h1> : ""}
                <Link to = {`/home/detail/${post._id}`}><img style = {{width: '200px'}} src = {post.petImage.url} alt=""></img></Link>
                <h3>{`Estado: ${post.state}`}</h3>
                <h3>{`Tipo: ${post.type}`}</h3>
                <h3>{`Genero: ${post.genre}`}</h3> 
              </div>
            </Popup>
          </Marker> 
          : post.state === 'Adopción' ?
          <Marker 
            key={post._id}
            
            position={[post.latitude? post.latitude : '', post.longitude? post.longitude : '']} 
            
            icon={icon2}
            >
            <Popup> 
              <div style = {{width: '200px'}}>
                {post.name?<Link to = {`/home/detail/${post._id}`}> <h1>{`Nombre: ${post.name}`}</h1></Link> : ""}
                <Link to = {`/home/detail/${post._id}`}><img style = {{width: '200px'}} src = {post.petImage.url} alt=""></img></Link>
                <h3>{`Estado: ${post.state}`}</h3>
                <h3>{`Tipo: ${post.type}`}</h3>
                <h3>{`Genero: ${post.genre}`}</h3> 
              </div>
            </Popup>
          </Marker> : ""
        ))}
        <LeafletControlGeocoder originPost={originPost}/>
      </MapContainer>
    );
  }, [allPosts, error, icon, icon2, icon3]);

  return (
    <>
      
      {map ? <DisplayPosition map={map} /> : null}
      {displayMap}
    </>
  );
}


