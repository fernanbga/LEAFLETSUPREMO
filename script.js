var map = L.map('map').setView([40.42, -3.701667], 1)

var Stadia_StamenToner = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map);

//Ejercicio terremoto
async function getData1() {
  try {
    const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
    const data = await res.json();
    return data.features;
  } catch (error) {
      console.error('Error en la solicitud:', error.message);
      }
};

getData1().then(data => {

// console.log(data);
//Agregar marcador

//Extraer coordenadas
data.map(pin => {  
                                    //  Lat---------------------------- Long
  const coordinates_pin = [pin.geometry.coordinates[1],pin.geometry.coordinates[0]];
        console.log(coordinates_pin);
      const diaD = new Date(pin.properties.time) //convierto la fecha a obj

      const magnitud = pin.properties.mag; 
      let color = "";// agrego los colores, los mismos de ejemplo :p

        if (magnitud >= 7) {
            color = "#ff00f8";
          } else if (magnitud >= 6) {
            color = "#ff0000";
          } else if (magnitud >= 5) {
            color = "#ff9800";
          } else if (magnitud >= 4) {
            color = "#ffe12e";
          } else if (magnitud >= 3) {
            color = "#fcff06";
          } else if (magnitud >= 2) {
            color = "#a4b619";
          } else if (magnitud >= 1) {
            color = "#00ff00";
          } else {
            color = "#ffffff";
};
        // Representación de datos

    L.circle(coordinates_pin, {
      color: color,
      fillColor: color,
      fillOpacity: 0.5,
      radius: 50000

      //Popups
    }).bindPopup(` 
      <strong>Título: ${pin.properties.title}</strong><br>
              <strong>Fecha: </strong>${diaD.toLocaleString()}<br>
              <strong>Ubicación: </strong>${pin.properties.place}<br>
              <strong>Código: </strong>${pin.properties.code}<br>
              <strong>Magnitud grados Richter: </strong>${magnitud}`) 
    .addTo(map);
  });
});

//---------MAPA 2 ----------

const map2 = L.map('map2').setView([-37.481521, -72.354196], 1);//Casa

var Stadia_StamenToner = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map2);

const pin = L.marker([-37.481521, -72.354196]).addTo(map2);
pin.bindPopup('<b>Casa</b>'); //Casita 

//Funcion para hacer fetch y marcar sismos

async function getData(startDate, endDate, minMag, maxMag) {
  try {                                                                                                     //Rango de fechas                     //Filtro magnitud
    const res = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&minmagnitude=${minMag}&maxmagnitude=${maxMag}`);

    const data = await res.json();
      return data.features;
      } catch (error) {
    console.error('Error en la solicitud:', error.message);
  }
};

let marcadoresDinamicos = []; //Guarda pines

document.getElementById('filtrarBtn').addEventListener('click', async () => {
  const minMag = parseFloat(document.getElementById('minMag').value); //parseFloat convierte string en numero dec.
  const maxMag = parseFloat(document.getElementById('maxMag').value);
  const startDateInput = document.getElementById('startDate').value;
  const endDateInput = document.getElementById('endDate').value;

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

        // Limpiar pines anteriores
    
    marcadoresDinamicos.forEach(m => map2.removeLayer(m));
    marcadoresDinamicos = [];
    


const data = await getData(startDateInput, endDateInput, minMag, maxMag);

  data.forEach(pin => {
    const coords = [pin.geometry.coordinates[1], pin.geometry.coordinates[0]];
    const time = new Date(pin.properties.time);
    const mag = pin.properties.mag;

    const cumpleMagnitud = mag >= minMag && mag <= maxMag; //Ambas se deben cumplir
    const cumpleFecha = (!isNaN(startDate) ? time >= startDate : true) &&
                        (!isNaN(endDate) ? time <= endDate : true);

    if (cumpleMagnitud && cumpleFecha) {
      const marker = L.marker(coords).addTo(map2);
        marker.bindPopup(`
          <strong>Título: ${pin.properties.title}</strong><br>
          <strong>Fecha: </strong>${time.toLocaleString()}<br>
          <strong>Ubicación: </strong>${pin.properties.place}<br>
          <strong>Código: </strong>${pin.properties.code}<br>
          <strong>Magnitud grados Richter: </strong>${mag}
        `);
      marcadoresDinamicos.push(marker); //Guardar los marker 
    }
  });
});


// minMag Magnitud mínima
// masMag magnitud máxima
// startDate Fecha inicio
// endDate Fecha fin
// filtrarBtn Filtrar terremotos 