
        $(function () {
            $('#pickupDateTime').datetimepicker({
                format: 'YYYY-MM-DD HH:mm',
                icons: {
                    time: 'fa fa-clock',
                    date: 'fa fa-calendar',
                    up: 'fa fa-arrow-up',
                    down: 'fa fa-arrow-down',
                    previous: 'fa fa-chevron-left',
                    next: 'fa fa-chevron-right',
                    today: 'fa fa-calendar-check-o',
                    clear: 'fa fa-trash',
                    close: 'fa fa-times'
                },
                minDate: moment().startOf('day'),
                sideBySide: true // Shows the time next to the calendar
            });

            $('#returnDateTime').datetimepicker({
                format: 'YYYY-MM-DD HH:mm',
                useCurrent: false, // Do not set initial date
                icons: {
                    time: 'fa fa-clock',
                    date: 'fa fa-calendar',
                    up: 'fa fa-arrow-up',
                    down: 'fa fa-arrow-down',
                    previous: 'fa fa-chevron-left',
                    next: 'fa fa-chevron-right',
                    today: 'fa fa-calendar-check-o',
                    clear: 'fa fa-trash',
                    close: 'fa fa-times'
                },
                sideBySide: true // Shows the time next to the calendar
            });

            // Validate return date is after pickup date
            $("#pickupDateTime").on("change.datetimepicker", function (e) {
                $('#returnDateTime').datetimepicker('minDate', e.date);
            });

            // Validate pickup date is before return date
            $("#returnDateTime").on("change.datetimepicker", function (e) {
                $('#pickupDateTime').datetimepicker('maxDate', e.date);
            });
        });

        function openBookingForm(car) {
            const carDetails = `${car.build.make} ${car.build.model} (${car.build.year})`;
            document.getElementById('carDetails').value = carDetails;
            $('#bookingFormModal').modal('show');
        }

        function checkAvailability(pickupDateTime, returnDateTime) {
            // Simulated availability check
            // Replace this with your actual availability checking logic
            // For simplicity, assuming all bookings are available if dates are set
            const availability = Math.random() < 0.5;
            if (pickupDateTime && returnDateTime) {
                // Show booking form if available
                $('#bookingFormModal').modal('show');
            } else {
                // Show alert or message indicating unavailability
                alert('Please select both pickup and return dates.');
            }
        }

        function calculatePricePerDay(carPrice, pickupDateTime, returnDateTime) {
            const pickupDate = moment(pickupDateTime, 'YYYY-MM-DD HH:mm');
            const returnDate = moment(returnDateTime, 'YYYY-MM-DD HH:mm');
            const duration = returnDate.diff(pickupDate, 'days');

            if (duration > 0) {
                const dailyRate = carPrice / duration;
                return dailyRate;
            } else {
                return 0;
            }
        }

        document.getElementById('bookingForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const location = document.getElementById('location').value;
            const pickupDateTime = document.getElementById('pickupDateTime').querySelector('input').value;
            const returnDateTime = document.getElementById('returnDateTime').querySelector('input').value;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const carDetails = document.getElementById('carDetails').value;

            const carPrice = 20000; // Example car price, replace with actual car price
            const dailyRate = calculatePricePerDay(carPrice, pickupDateTime, returnDateTime);

            console.log(`Booking confirmed for ${name}, ${email}, ${phone}, at ${location} from ${pickupDateTime} to ${returnDateTime}, for car: ${carDetails}`);

            $('#bookingFormModal').modal('hide');

            alert('Booking confirmed!');
        });

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
            card.style.height = "400px"; // Adjusted to fit the button

            // Card body
            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body", "row");

            // Left side for the image
            let leftSide = document.createElement("div");
            leftSide.classList.add("col-md-6");

            let carImage = document.createElement("img");
            carImage.src = car.media.photo_links[0]; // Accessing the first element of photo_links array
            carImage.classList.add("img-fluid"); // Bootstrap class for responsive images
            leftSide.appendChild(carImage);

            // Right side for car details and price
            let rightSide = document.createElement("div");
            rightSide.classList.add("col-md-6");

            let title = document.createElement("h5");
            title.classList.add("card-title");
            title.textContent = `${car.build.make} ${car.build.model}`;
            rightSide.appendChild(title);

            let year = document.createElement("p");
            year.classList.add("card-text");
            year.innerHTML = `<strong>Year:</strong> ${car.build.year}`;
            rightSide.appendChild(year);

            let bodytype = document.createElement("p");
            bodytype.classList.add("card-text");
            bodytype.innerHTML = `<strong>Body Type:</strong> ${car.build.body_type}`;
            rightSide.appendChild(bodytype);

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
            priceElement.classList.add("card-text");
            priceElement.innerHTML = `<strong>Price:</strong> $${car.price}`;
            rightSide.appendChild(priceElement);
            
            // let pricePerDayElement = document.createElement("p");
            // pricePerDayElement.classList.add("card-text");
            // pricePerDayElement.innerHTML = `<strong>Price per Day:</strong> $${car.pricePerDay}`;
            // rightSide.appendChild(pricePerDayElement);

            // "Book Now" button
            let bookButton = document.createElement("button");
            bookButton.classList.add("btn", "btn-primary", "mt-2");
            bookButton.textContent = "Book Now";
            bookButton.addEventListener("click", () => openBookingForm(car));
            rightSide.appendChild(bookButton);

            cardBody.appendChild(leftSide);
            cardBody.appendChild(rightSide);

            card.appendChild(cardBody);
            col.appendChild(card);
            row.appendChild(col);
        }

        // Example usage:
        const output = document.getElementById('content');
        const car = {
            build: {
                make: 'Toyota',
                model: 'Corolla',
                year: 2020,
                body_type: 'Sedan',
                fuel_type: 'Gasoline',
                drivetrain: 'FWD',
                engine: '1.8L I4',
                cylinders: 4,
                city_mpg: 30
            },
            media: {
                photo_links: ['https://via.placeholder.com/150']
            },
            price: 20000,
        };

        displayCarAndImage(car, output);