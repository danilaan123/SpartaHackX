document.addEventListener('DOMContentLoaded', () => {
    initializeButtons();
    initializeListings();
    loadListings();
    
});

function initializeListings() {
    if (!localStorage.getItem('listings')) {
        localStorage.setItem('listings', JSON.stringify([]));
    }
}

function initializeButtons() {
    const backButton = document.querySelector('.header .back-button');
    backButton.addEventListener('click', (e) => {
        e.stopPropagation();
        window.history.back();
    });

    const newListingBtn = document.querySelector('.new-listing-btn');
    newListingBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('listingModal').style.display = 'flex';
    });

    const closeModalButtons = document.querySelectorAll('.close-modal');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('listingModal').style.display = 'none';
            document.getElementById('detailModal').style.display = 'none';
        });
    });

    const listingForm = document.getElementById('listingForm');
    if (listingForm) {
        listingForm.addEventListener('submit', function(e) {
            console.log('Form submitted');
            e.preventDefault();
            e.stopPropagation();
            addNewListing();
        });
    }

    const modalBackButton = document.querySelector('.modal-back-button');
    if (modalBackButton) {
        modalBackButton.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('listingModal').style.display = 'none';
        });
    }

    const sortBtn = document.querySelector('.sort-btn');
    sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleSort();
    });

    const filterBtn = document.querySelector('.filter-btn');
    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleFilter();
    });
}

function loadListings() {
    const listings = JSON.parse(localStorage.getItem('listings')) || [];
    const grid = document.querySelector('.grid-container');
    grid.innerHTML = '';

    listings.forEach(listing => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.dataset.id = listing.id;
        itemCard.dataset.status = listing.status;

        itemCard.innerHTML = `
            <img src="${listing.image}" alt="${listing.title}" class="item-image">
            <div class="card-footer">
                <div class="user-info">
                    <a href="builder-interface-ts.html">
                        <button class=user-avatar>
                        <img src="images/bob_the_builder.jpg" alt="avatar" class="user-avatar">
                        </button>
                    </a>
                    <span class="username">Bob</span>
                </div>
                <button class="like-button">${listing.liked ? '♥' : '♡'}</button>
                <button class="delete-button">Delete</button>
            </div>
        `;

        // Add click event to open detailed view
        itemCard.addEventListener('click', (e) => {
            e.stopPropagation();
            openDetailModal(listing);
        });

        grid.appendChild(itemCard);
    });

    // Add event listeners to buttons after cards are created
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
        button.addEventListener('click', handleLike);
    });

    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

function openDetailModal(listing) {
    const detailModal = document.getElementById('detailModal');
    const detailImage = document.getElementById('detailImage');
    const detailTitle = document.getElementById('detailTitle');
    const detailDescription = document.getElementById('detailDescription');

    // Populate modal with listing data
    detailImage.src = listing.image;
    detailTitle.textContent = listing.title;
    detailDescription.textContent = listing.description;

    // Display the modal
    detailModal.style.display = 'flex';
}

function addNewListing() {
    console.log('addNewListing function called');
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const status = document.getElementById('status').value;
    const imageFile = document.getElementById('image').files[0];

    console.log('Form values:', { title, description, status });

    if (!title || !description || !status) {
        alert('Please fill in all fields');
        return;
    }

    if (!imageFile) {
        alert('Please upload an image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const newListing = {
                id: Date.now(),
                title,
                description,
                status,
                image: event.target.result,
                liked: false
            };

            const listings = JSON.parse(localStorage.getItem('listings')) || [];
            listings.push(newListing);
            localStorage.setItem('listings', JSON.stringify(listings));

            document.getElementById('listingForm').reset();
            document.getElementById('listingModal').style.display = 'none';
            loadListings();
            
            console.log('Listing added successfully');
        } catch (error) {
            console.error('Error saving listing:', error);
            alert('There was an error saving your listing. Please try again.');
        }
    };

    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        alert('There was an error processing your image. Please try again.');
    };

    reader.readAsDataURL(imageFile);
}

function handleLike(event) {
    event.stopPropagation(); // Prevent triggering the card click event
    const button = event.currentTarget;
    const itemCard = button.closest('.item-card');
    const itemId = itemCard.dataset.id;

    try {
        const listings = JSON.parse(localStorage.getItem('listings')) || [];
        const listing = listings.find(listing => listing.id == itemId);
        if (listing) {
            listing.liked = !listing.liked;
            localStorage.setItem('listings', JSON.stringify(listings));
            button.textContent = listing.liked ? '♥' : '♡';
        }
    } catch (error) {
        console.error('Error updating like status:', error);
        alert('There was an error updating the like status. Please try again.');
    }
}

function handleDelete(event) {
    event.stopPropagation(); // Prevent triggering the card click event
    const button = event.currentTarget;
    const itemCard = button.closest('.item-card');
    const itemId = itemCard.dataset.id;

    const confirmDelete = confirm('Are you sure you want to delete this listing?');
    if (!confirmDelete) return;

    try {
        const listings = JSON.parse(localStorage.getItem('listings')) || [];
        const updatedListings = listings.filter(listing => listing.id != itemId);
        localStorage.setItem('listings', JSON.stringify(updatedListings));
        itemCard.remove();
    } catch (error) {
        console.error('Error deleting listing:', error);
        alert('There was an error deleting the listing. Please try again.');
    }
}

// Placeholder functions for sort and filter (implement as needed)
function handleSort() {
    console.log('Sort functionality to be implemented');
}

function handleFilter() {
    console.log('Filter functionality to be implemented');
}

