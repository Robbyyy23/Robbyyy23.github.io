import { Car } from './Car.js';
function addToFavorites(car) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (!favorites.some(favorite => favorite.model === car.model)) {
      favorites.push(car);

      localStorage.setItem('favorites', JSON.stringify(favorites));

      alert(`${car.make} ${car.model} added to favorites!`);
  } else {
      alert(`${car.make} ${car.model} is already in favorites!`);
  }
}

 function displayCar(element, output, addButtons = true) {

  if (output.children.length % 4 === 0) {
    let row = document.createElement("div");
    row.classList.add("row");
    output.appendChild(row);
}

let row = output.lastElementChild;

let cardCol = document.createElement("div");
cardCol.classList.add("col-md-4", "mb-3"); 

let card = document.createElement("div");
card.classList.add("card", "text-white", "bg-secondary", "mb-3","sizeCard", "text-left");
card.style.maxWidth = "18rem";

let cardHeader = document.createElement("div");
cardHeader.classList.add("card-header");
cardHeader.textContent = element.make + " " + element.model;

let cardBody = document.createElement("div");
cardBody.classList.add("card-body");


let cardTextyear = document.createElement("p");
cardTextyear.classList.add("card-text");
cardTextyear.textContent = "Year: " + element.year;


let cardTextfuel_type = document.createElement("p");
cardTextfuel_type.classList.add("card-text");
cardTextfuel_type.textContent = "Fuel Type: " + element.fuel_type;


let cardTextdrive = document.createElement("p");
cardTextdrive.classList.add("card-text");
cardTextdrive.textContent = "Drive: " + element.drive;


cardBody.appendChild(cardTextyear);
cardBody.appendChild(cardTextfuel_type);
cardBody.appendChild(cardTextdrive);


card.appendChild(cardHeader);
card.appendChild(cardBody);

cardCol.appendChild(card);
if (addButtons) {
  let addButton = document.createElement("button");
  addButton.classList.add("btn", "btn-dark", "mt-2");
  addButton.textContent = "Add to Favorites";
  addButton.onclick = () => addToFavorites(element);
  cardBody.appendChild(addButton);
}
row.appendChild(cardCol);
  
}
window.displayCar = displayCar;
 function displayCars(cars, buttons = true) {
  let output = document.getElementById("content");
  console.log(output);
  cars.forEach(element => {
      displayCar(element, output, buttons); 
  });
}
window.displayCars = displayCars;

const carMakes = [
  "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Buick", "Cadillac", 
  "Chevrolet", "Chrysler", "Citroen", "Dodge", "Ferrari", "Fiat", "Ford", "Genesis", 
  "GMC", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", "Lamborghini", 
  "Land Rover", "Lexus", "Lincoln", "Lotus", "Maserati", "Mazda", "McLaren", 
  "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Pagani", "Peugeot", "Porsche", 
  "Ram", "Renault", "Rolls-Royce", "Saab", "Subaru", "Suzuki", "Tesla", "Toyota", 
  "Volkswagen", "Volvo"
];

const carMakesDropdown = document.getElementById("carMakesDropdown");
carMakesDropdown.innerHTML = "";

carMakes.forEach(make => {
    const option = document.createElement('option');
    option.value = make;
    option.textContent = make;
    carMakesDropdown.appendChild(option);
});

function fetchCarData() {
  document.getElementById('loader').style.display = 'block';

  const baseUrl = "https://api.api-ninjas.com/v1/cars";
  const apiKey = "ohzbZk1Fx+0xhXkOL2n18Q==03nANehB6Bo6JEau";

  const carMake = document.getElementById("carMakesDropdown").value.trim();
  const carModel = document.getElementById("carModel").value.trim();
  const carYear = document.getElementById("carYear").value.trim();

  let url = `${baseUrl}?limit=10&make=${carMake}`;
  if (carModel) url += `&model=${carModel}`;
  if (carYear) url += `&year=${carYear}`;

  fetch(url, {
    headers: {
      "X-Api-Key": apiKey,
    },
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  })
  .then(data => {
    console.log("Data received for", carMake, ":", data); 

    const cars = data.map(item => new Car(item));

    displayCars(cars);

    setTimeout(() => {
      document.getElementById('loader').style.display = 'none';
      document.getElementById('content').style.display = 'block';
    }, 3000); 
  })
  .catch(error => {
    document.getElementById('loader').style.display = 'none';
    console.error("Error:", error.message);
  });
}







  window.fetchCarData = fetchCarData;
 