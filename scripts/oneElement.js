async function fetchCarData(carMake, carModel) {
    const marketcheckApiKey = '5952fe26-9f33-49bd-9afd-0a28f74f12fd';
    const marketcheckUrl = `https://mc-api.marketcheck.com/v2/search/car/recents?api_key=${marketcheckApiKey}&state=NY&make=${encodeURIComponent(carMake)}&model=${encodeURIComponent(carModel)}&price_range=1-9999999&rows=1`;

    try {
        const response = await fetch(marketcheckUrl);
        const data = await response.json();
        if (data && data.listings && data.listings.length > 0) {
            const car = data.listings[0];
            console.log(car);
            return car;
        } else {
            console.log("No car data found for the specified make and model");
            return null;
        }
    } catch (error) {
        console.error("Error fetching car data:", error);
        return null;
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
        console.log(result);
        return result.value;
    } catch (error) {
        console.error("Error fetching car image:", error);
        return null;
    }
}

function displayCarAndImage(car, image, output) {
    let card = document.createElement("div");
    card.classList.add("card", "mb-3");

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "row");

    // Left side for the image
    let leftSide = document.createElement("div");
    leftSide.classList.add("col-md-6");

    let carImage = document.createElement("img");
    carImage.src = image.contentUrl;
    carImage.classList.add("img-fluid"); // Bootstrap class for responsive images
    leftSide.appendChild(carImage);

    // Right side for car details and price
    let rightSide = document.createElement("div");
    rightSide.classList.add("col-md-6");

    let title = document.createElement("h2");
    title.classList.add("titleONE");
    title.textContent = `${car.heading}`;
    rightSide.appendChild(title);

    let cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = car.build.year;
    rightSide.appendChild(cardTitle);

    let classElement = document.createElement("p");
    classElement.classList.add("card-text", "mb-1");
    classElement.innerHTML = `<strong>Class:</strong> ${car.build.body_type}`;
    rightSide.appendChild(classElement);

    let fuelType = document.createElement("p");
    fuelType.classList.add("card-text", "mb-1");
    fuelType.innerHTML = `<strong>Fuel Type:</strong> ${car.build.fuel_type}`;
    rightSide.appendChild(fuelType);

    let drive = document.createElement("p");
    drive.classList.add("card-text", "mb-1");
    drive.innerHTML = `<strong>Drive:</strong> ${car.build.drivetrain}`;
    rightSide.appendChild(drive);

    let displacement = document.createElement("p");
    displacement.classList.add("card-text", "mb-1");
    displacement.innerHTML = `<strong>Displacement:</strong> ${car.build.engine}`;
    rightSide.appendChild(displacement);

    let cylinders = document.createElement("p");
    cylinders.classList.add("card-text", "mb-1");
    cylinders.innerHTML = `<strong>Cylinders:</strong> ${car.build.cylinders}`;
    rightSide.appendChild(cylinders);

    let combinedMPG = document.createElement("p");
    combinedMPG.classList.add("card-text", "mb-1");
    combinedMPG.innerHTML = `<strong>Combined MPG:</strong> ${car.build.city_mpg}`;
    rightSide.appendChild(combinedMPG);

    let priceElement = document.createElement("p");
    priceElement.classList.add("card-text", "mb-1");
    priceElement.innerHTML = `<strong>Price:</strong> $${car.price}`;
    rightSide.appendChild(priceElement);

    cardBody.appendChild(leftSide);
    cardBody.appendChild(rightSide);

    card.appendChild(cardBody);
    output.appendChild(card);
}

document.addEventListener('DOMContentLoaded', () => {
    const carMake = 'Porsche';
    const carModel = '911';

    fetchCarData(carMake, carModel)
        .then(car => {
            if (car) {
                fetchCarImage(carMake, carModel)
                    .then(images => {
                        if (images && images.length > 0) {
                            const output = document.getElementById('content');
                            displayCarAndImage(car, images[0], output);
                        } else {
                            console.log("Failed to fetch car images or no images found.");
                        }
                    });
            } else {
                console.log('No cars found for the specified make and model');
            }
        });
});
