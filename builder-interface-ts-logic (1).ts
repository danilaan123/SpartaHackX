// app.ts
interface ViewElements {
    listingsTab: HTMLButtonElement;
    savedTab: HTMLButtonElement;
    listingsView: HTMLElement;
    savedView: HTMLElement;
}

class BuilderInterface {
    private elements: ViewElements;

    constructor() {
        this.elements = {
            listingsTab: document.getElementById('listingsTab') as HTMLButtonElement,
            savedTab: document.getElementById('savedTab') as HTMLButtonElement,
            listingsView: document.getElementById('listingsView') as HTMLElement,
            savedView: document.getElementById('savedView') as HTMLElement
        };

        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        this.elements.listingsTab.addEventListener('click', () => this.switchView('listings'));
        this.elements.savedTab.addEventListener('click', () => this.switchView('saved'));

        // Add click handlers for grid items
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleItemClick(e));
        });

        // Home button navigation
        const homeButton = document.querySelector('.home-button');
        homeButton?.addEventListener('click', () => this.navigateHome());
    }

    private switchView(view: 'listings' | 'saved'): void {
        // Update tab styles
        this.elements.listingsTab.classList.toggle('active', view === 'listings');
        this.elements.savedTab.classList.toggle('active', view === 'saved');

        // Show/hide appropriate view
        this.elements.listingsView.style.display = view === 'listings' ? 'grid' : 'none';
        this.elements.savedView.style.display = view === 'saved' ? 'grid' : 'none';
    }

    private handleItemClick(e: Event): void {
        const target = e.currentTarget as HTMLElement;
        // Handle navigation to item detail page
        console.log('Navigating to item details page');
    }

    private navigateHome(): void {
        // Handle navigation to home page
        console.log('Navigating to home page');
    }
}

// Initialize the interface when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BuilderInterface();
});
