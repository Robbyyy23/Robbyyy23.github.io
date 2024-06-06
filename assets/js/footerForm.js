// footerForm.js

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('footer-contact').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('footer-name').value;
        const email = document.getElementById('footer-email').value;
        const message = document.getElementById('footer-message').value;

        const requestData = {
            name: name,
            email: email,
            message: message
        };

        // Save to local storage
        let requests = JSON.parse(localStorage.getItem('footerRequests')) || [];
        requests.push(requestData);
        localStorage.setItem('footerRequests', JSON.stringify(requests));

        alert('Your request has been stored.');
        console.log(requests);
        document.getElementById('footer-contact').reset();
    });
});
