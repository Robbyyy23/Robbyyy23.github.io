function removeFromFavorites(car) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let updatedFavorites = favorites.filter(favorite => !(favorite.make === car.make && favorite.model === car.model && favorite.year === car.year));
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  displayFavorites();
}

function displayFavorites() {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = ""; 

  favorites.forEach(car => {
    let listItem = document.createElement('li');
    listItem.classList.add('d-flex', 'justify-content-between', 'align-items-center');

    let carName = document.createElement('span');
    carName.textContent = car.make + ' ' + car.model + ' ' + car.year;
    listItem.appendChild(carName);

    let searchButton = document.createElement('button');
    searchButton.textContent = 'Search Image';
    searchButton.classList.add('btn', 'btn-primary', 'me-2');
    searchButton.onclick = () => searchImg(car);
    listItem.appendChild(searchButton);

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Remove';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.onclick = () => removeFromFavorites(car);
    listItem.appendChild(deleteButton);

    favoritesList.appendChild(listItem);
  });
}

document.addEventListener('DOMContentLoaded', displayFavorites);
