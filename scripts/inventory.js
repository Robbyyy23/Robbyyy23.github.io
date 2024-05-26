document.addEventListener('DOMContentLoaded', () => {
    const carMakesDropdown = document.getElementById('carMakesDropdown');
    const carMakes = ["AM General", "AMC", "Acura", "Alfa Romeo", "Aston Martin", "Audi", "BMW", "Bentley",
    "Bugatti", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Daewoo", "Daihatsu", "Datsun", "Dodge", "Eagle",
    "FIAT", "Ferrari", "Fisker", "Ford", "GMC", "Genesis", "Geo", "HUMMER", "Honda", "Hyundai", "INFINITI",
    "Ineos", "Isuzu", "Jaguar", "Jeep", "KIA", "Karma", "Lamborghini", "Land Rover", "Lexus", "Lincoln",
    "Lotus", "Lucid", "MINI", "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "Mercury",
    "Mitsubishi", "Nissan"];


    // Populate car makes dropdown
    carMakes.forEach(make => {
        const option = document.createElement('option');
        option.value = make;
        option.textContent = make;
        carMakesDropdown.appendChild(option);
    });

    const carTypesDropdown = document.getElementById('carTypesDropdown');
    const body_types = [ 
        "Car Van","Cargo Van","Chassis Cab","Combi", "Convertible","Coupe",
        "Hatchback","Micro Car","Mini Mpv","Minivan","Passenger Van","Pickup",
        "SUV","Sedan","Targa","Van","Wagon"
        ];
    body_types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            carTypesDropdown.appendChild(option);
        });
});

//https://mc-api.marketcheck.com/v2/search/car/auto-complete?api_key=5952fe26-9f33-49bd-9afd-0a28f74f12fd&input=&field=body_type

async function fetchCarData(carMakes=[], carModel=null, year=null, body_type=null) {
    const marketcheckApiKey = '5952fe26-9f33-49bd-9afd-0a28f74f12fd';
    let marketcheckUrl = `https://mc-api.marketcheck.com/v2/search/car/active?api_key=${marketcheckApiKey}&price_range=1-999999&facets=make&facet_min_count=5`; 

    if (carMakes) {
        for (const make of carMakes) {
            marketcheckUrl += `&make=${encodeURIComponent(make)}`;
        }
    }

    // Add model to the URL if provided
    if (carModel) {
        marketcheckUrl += `&model=${encodeURIComponent(carModel)}`;
    }

    // Add year to the URL if provided
    if (year) {
        marketcheckUrl += `&year=${encodeURIComponent(year)}`;
    }

    // Add bodytype to the URL if provided
    if (body_type) {
        marketcheckUrl += `&body_type=${encodeURIComponent(body_type)}`;
    }

    try {
        const response = await fetch(marketcheckUrl);
        const data = await response.json();
        
        if (data && data.listings && data.listings.length > 0) {
            // Create a map to store the newest and most expensive car for each model
            const carMap = new Map();

            data.listings.forEach(car => {
                const modelKey = car.build.model;

                // Check if this car is newer or more expensive than the one already stored
                if (!carMap.has(modelKey) ||
                    car.build.year > carMap.get(modelKey).build.year ||
                    (car.build.year === carMap.get(modelKey).build.year && car.price > carMap.get(modelKey).price)) {
                    carMap.set(modelKey, car);
                }
            });

            console.log(Array.from(carMap.values()));
            // Return the filtered list of cars
            return Array.from(carMap.values());
        } else {
            console.log("No car data found for the specified makes");
            return [];
        }
    } catch (error) {
        console.error("Error fetching car data:", error);
        return [];
    }
}

async function fetchCarImage(carMake, carModel) {
    const imageUrl = `https://images-search1.p.rapidapi.com/search?q=${encodeURIComponent(carMake)} ${encodeURIComponent(carModel)}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0b668656bbmsh1e62876a724c45ep17f0b8jsnc135fe27ea52',
            'X-RapidAPI-Host': 'images-search1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(imageUrl, options);
        const result = await response.json();
        return result.value;
    } catch (error) {
        console.error("Error fetching car image:", error);
        return [];
    }
}

function displayCarAndImage(car, output) {
    // Create a new row for each card
    let row = document.createElement("div");
    row.classList.add("row", "mb-3");
    output.appendChild(row);

    let col = document.createElement("div");
    col.classList.add("col-md-12");

    // Create the card
    let card = document.createElement("div");
    card.classList.add("card");
    card.style.height = "350px";

    // Card body
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "row");

    // Left side for the image
    let leftSide = document.createElement("div");
    leftSide.classList.add("col-md-6");

    let carImage = document.createElement("img");
    carImage.classList.add("img-fluid");
    carImage.style.height = "300px";
    
    const setImageSource = (imgElement, sources, index) => {
        if (index >= sources.length) {
            fetchCarImage(car.build.make, car.build.model)
            .then(images => {
                if (images && images.length > 0) {
                    imgElement.src = images[0].contentUrl; // Set the first fetched image URL
                    //console.log("Fetched car image from other API");
                    return;
                } else {
                    console.log("Failed to fetch car images or no images found.");
                    imgElement.src = './assets/hiclipart.com.png'; // Set a fallback image URL if no images found
                }
            }).catch(error => {
                console.error("Error fetching fallback car images:", error);
                imgElement.src = './assets/hiclipart.com.png'; // Set a fallback image URL on error
            });
            return;
        }
    
        imgElement.src = sources[index];
        imgElement.onerror = () => setImageSource(imgElement, sources, index + 1);
    };
    
    // Use the updated setImageSource function
    setImageSource(carImage, car.media.photo_links, 0);
    leftSide.appendChild(carImage);
    

    // Right side for car details and price
    let rightSide = document.createElement("div");
    rightSide.classList.add("col-md-6");

    let title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = `${car.build.make} ${car.build.model}`;
    rightSide.appendChild(title);

    // Function to add details if defined
    const addDetail = (label, value) => {
        if (value !== undefined) {
            let detail = document.createElement("p");
            detail.classList.add("card-text");
            detail.innerHTML = `<strong>${label}:</strong> ${value}`;
            rightSide.appendChild(detail);
        }
    };

    addDetail('Year', car.build.year);
    addDetail('Body Type', car.build.body_type);
    addDetail('Fuel Type', car.build.fuel_type);
    addDetail('Drive', car.build.drivetrain);
    addDetail('Displacement', car.build.engine);
    addDetail('Cylinders', car.build.cylinders);
    addDetail('Combined MPG', car.build.city_mpg);

    let priceElement = document.createElement("p");
    priceElement.classList.add("card-text");
    priceElement.innerHTML = `<strong>Price:</strong> $${car.price}`;
    rightSide.appendChild(priceElement);

    cardBody.appendChild(leftSide);
    cardBody.appendChild(rightSide);

    card.appendChild(cardBody);
    col.appendChild(card);
    row.appendChild(col);
}



async function loadCarData() {
    const carMakesDropdown = document.getElementById('carMakesDropdown');
    const carModelInput = document.getElementById('carModel');
    const carYearInput = document.getElementById('carYear');
    const carTypeInput = document.getElementById('carTypesDropdown');
    const output = document.getElementById('content');
    const loader = document.getElementById('loader');

    const carMake = carMakesDropdown.value;
    const carModel = carModelInput.value;
    const carYear = carYearInput.value;
    const carType = carTypeInput.value;

    
    // Show loader
    loader.style.display = 'block';
    output.style.display = 'none';

    // Fetch data for the selected car make, model, and year
    const cars = await fetchCarData([carMake], carModel, carYear, carType);

    // Clear previous content
    output.innerHTML = '';

    if (cars.length > 0) {
    for (const car of cars) {
                displayCarAndImage(car, output);
            }}
        else {
                output.innerHTML = '<p>No cars found.</p>';
            }

    // Hide loader and show content
    loader.style.display = 'none';
    output.style.display = 'flex';
}
