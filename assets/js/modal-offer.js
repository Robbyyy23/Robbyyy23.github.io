$(function () {
    $('#pickupDate').datetimepicker({
      format: 'DD-MM-YYYY',
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
      minDate: moment().startOf('day')
    });

    $('#returnDate').datetimepicker({
      format: 'DD-MM-YYYY',
      useCurrent: false,
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
      minDate: moment().startOf('day')
    });

    $("#pickupDate").on("change.datetimepicker", function (e) {
      $('#returnDate').datetimepicker('minDate', e.date.add(1, 'days'));
    });

    $("#returnDate").on("change.datetimepicker", function (e) {
      $('#pickupDate').datetimepicker('maxDate', e.date.substract(1, 'days'));
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('contact').addEventListener('submit', function(event) {
      event.preventDefault();

      const pickupLocation = document.getElementById('pickup-location').value;
      const returnLocation = document.getElementById('return-location').value;
      const pickupDate = document.getElementById('pickupDate').querySelector('input').value;
      const pickupTime = document.getElementById('pickupTime').value;
      const returnDate = document.getElementById('returnDate').querySelector('input').value;
      const returnTime = document.getElementById('returnTime').value;
      const fullName = document.getElementById('full-name').value;
      const emailAddress = document.getElementById('email-address').value;
      const phone = document.getElementById('phone').value;

      const formData = {
        'pickupLocation': pickupLocation,
        'returnLocation': returnLocation,
        'pickupDateTime': `${pickupDate} ${pickupTime}`,
        'returnDateTime': `${returnDate} ${returnTime}`,
        'fullName': fullName,
        'emailAddress': emailAddress,
        'phone': phone
      };

      // Save to local storage
      let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
      bookings.push(formData);
      localStorage.setItem('bookings', JSON.stringify(bookings));

      alert('Booking details saved.');
      console.log(bookings);

      // Clear form inputs after submission
      document.getElementById('contact').reset();

      // Optional: Close modal after submission (if Bootstrap modal is still open)
      $('#exampleModal').modal('hide');
    });
    // Ensure modal backdrop is removed and site is interactive after modal is closed
$('#exampleModal').on('hidden.bs.modal', function () {
  $('.modal-backdrop').remove();
  $('body').removeClass('modal-open');
});
  });