document.getElementById('contact').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    const requestData = {
        name: name,
        email: email,
        phone: phone,
        message: message
    };

    // Save to local storage
    let requests = JSON.parse(localStorage.getItem('requests')) || [];
    requests.push(requestData);
    localStorage.setItem('requests', JSON.stringify(requests));

    alert('Your request has been stored.');
    console.log(requests);
    document.getElementById('contact').reset();
});