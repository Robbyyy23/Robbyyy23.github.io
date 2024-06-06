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
    const marketcheckApiKey = 'kZmGbWDtpX8DVsH2MCNYMXFUJx1iC6d0';
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
    // Create a service item container
    let serviceItem = document.createElement("div");
    serviceItem.classList.add("col-lg-4", "col-md-6", "mb-4");

    // Create the card
    let card = document.createElement("div");
    card.classList.add("service-item");

    // Car image
    let carImage = document.createElement("img");
    carImage.classList.add("img-fluid");
    carImage.style.height = "300px";

    const setImageSource = (imgElement, sources, index) => {
        if (!sources || index >= sources.length) {
            fetchCarImage(car.build.make, car.build.model)
                .then(images => {
                    if (images && images.length > 0) {
                        imgElement.src = images[0].contentUrl; // Set the first fetched image URL
                    } else {
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
    
    // Usage example:
    setImageSource(carImage, car.media?.photo_links, 0); // Use optional chaining (?.) to safely access photo_links
    

    // Card body
    let downContent = document.createElement("div");
    downContent.classList.add("down-content");

    // Car title
    let carTitle = document.createElement("h4");
    carTitle.textContent = `${car.build.make} ${car.build.model}`;

    // Pricing
    let pricing = document.createElement("div");
    pricing.style.marginBottom = "10px";
    let priceSpan = document.createElement("span");
    priceSpan.innerHTML = `from <sup>$</sup>${Math.round(car.price / 365)} per weekend`; 
    pricing.appendChild(priceSpan);

    // Car details
    let carDetails = document.createElement("p");
    carDetails.innerHTML = `
        <i class="fa fa-user" title="Passengers"></i> ${car.build.std_seating? car.build.std_seating : '-'} &nbsp;&nbsp;&nbsp;
        <i class="fa fa-calendar" title="Luggages"></i> ${car.build.year? car.build.year : '-'} &nbsp;&nbsp;&nbsp;
        <i class="fa fa-sign-out" title="Doors"></i> ${car.build.doors ? car.build.doors : '-'} &nbsp;&nbsp;&nbsp;
        <i class="fa fa-cog" title="Transmission"></i> ${car.build.transmission === 'Automatic' ? 'A' : car.build.transmission === 'CVT' ? 'A' : (car.build.transmission === 'Manual' ? 'M' : '-')} &nbsp;&nbsp;&nbsp;<br>
        <i class="fa fa-cogs" title="Engine"></i> ${car.build.engine? car.build.engine : '-'} &nbsp;&nbsp;&nbsp;
        <i class="fa fa-dashboard" title="Fuel"></i> ${car.build.city_mpg? car.build.city_mpg : '-'} MPG &nbsp;&nbsp;&nbsp;
        <i class="fa fa-car" title="Body Type"></i> ${car.build.body_type? car.build.body_type : '-'} &nbsp;&nbsp;&nbsp;
    `;

    // Book Now button
    let bookNowBtn = document.createElement("a");
    bookNowBtn.href = "#";
    bookNowBtn.setAttribute("data-toggle", "modal");
    bookNowBtn.setAttribute("data-target", "#exampleModal");
    bookNowBtn.classList.add("filled-button");
    bookNowBtn.textContent = "Book Now";

    // Append elements
    downContent.appendChild(carTitle);
    downContent.appendChild(pricing);
    downContent.appendChild(carDetails);
    downContent.appendChild(bookNowBtn);

    card.appendChild(carImage);
    card.appendChild(downContent);
    serviceItem.appendChild(card);

    // Append to output container
    output.appendChild(serviceItem);
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
        cars.forEach(car => {
            displayCarAndImage(car, output);
        });
    } else {
        let errorMessage = document.createElement("div");
        errorMessage.classList.add("col-12", "text-center", "mt-5");
        errorMessage.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">No cars found for this search.</h4>
                <p>Please try again with different search criteria.</p>
            </div>
        `;
        output.appendChild(errorMessage);
    }

    loader.style.display = 'none';
    output.style.display = 'flex';
}
