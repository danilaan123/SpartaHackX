interface ViewElements {
    listingsTab: HTMLButtonElement;
    savedTab: HTMLButtonElement;
    listingsView: HTMLElement;
    savedView: HTMLElement;
    editProfileButton: HTMLButtonElement;
    infoPanels: NodeListOf<HTMLDivElement>;
    profileName: HTMLParagraphElement;
    profileMaterials: HTMLParagraphElement;
    lookingForItems: NodeListOf<HTMLParagraphElement>;
    avatarImage: HTMLImageElement;
    avatarContainer: HTMLDivElement;
}

class BuilderInterface {
    private elements: ViewElements;
    private isEditing: boolean = false;
    private fileInput: HTMLInputElement;
    private editableElements: Map<string, HTMLElement> = new Map();

    constructor() {
        this.elements = {
            listingsTab: document.getElementById('listingsTab') as HTMLButtonElement,
            savedTab: document.getElementById('savedTab') as HTMLButtonElement,
            listingsView: document.getElementById('listingsView') as HTMLElement,
            savedView: document.getElementById('savedView') as HTMLElement,
            editProfileButton: document.querySelector('.edit-profile') as HTMLButtonElement,
            infoPanels: document.querySelectorAll('.info-panel'),
            profileName: document.querySelector('.info-panel p') as HTMLParagraphElement,
            profileMaterials: document.querySelectorAll('.info-panel p')[1] as HTMLParagraphElement,
            lookingForItems: document.querySelectorAll('.looking-for-item'),
            avatarImage: document.querySelector('.avatar img') as HTMLImageElement,
            avatarContainer: document.querySelector('.avatar') as HTMLDivElement
        };

        this.createFileInput();
        this.initializeEventListeners();
    }

    private createFileInput(): void {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.accept = 'image/*';
        this.fileInput.style.display = 'none';
        document.body.appendChild(this.fileInput);

        this.fileInput.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        this.elements.avatarImage.src = e.target.result as string;
                    }
                };
                reader.readAsDataURL(target.files[0]);
            }
        });
    }

    private initializeEventListeners(): void {
        this.elements.listingsTab.addEventListener('click', () => this.switchView('listings'));
        this.elements.savedTab.addEventListener('click', () => this.switchView('saved'));
        this.elements.editProfileButton.addEventListener('click', () => this.toggleEditProfile());
    }

    private switchView(view: 'listings' | 'saved'): void {
        this.elements.listingsTab.classList.toggle('active', view === 'listings');
        this.elements.savedTab.classList.toggle('active', view === 'saved');
        this.elements.listingsView.style.display = view === 'listings' ? 'grid' : 'none';
        this.elements.savedView.style.display = view === 'saved' ? 'grid' : 'none';
    }

    private toggleEditProfile(): void {
        this.isEditing = !this.isEditing;
        this.elements.editProfileButton.textContent = this.isEditing ? 'Save Profile' : 'Edit Profile';

        // Toggle editing for profile picture
        if (this.isEditing) {
            this.elements.avatarContainer.style.cursor = 'pointer';
            this.elements.avatarContainer.addEventListener('click', () => this.fileInput.click());
            this.elements.avatarImage.style.opacity = '0.8';
        } else {
            this.elements.avatarContainer.style.cursor = 'default';
            this.elements.avatarContainer.removeEventListener('click', () => this.fileInput.click());
            this.elements.avatarImage.style.opacity = '1';
        }

        // Toggle editing for "Looking for" items
        this.elements.lookingForItems.forEach(item => {
            this.toggleEditableField(item as HTMLElement);
        });
    }

    private toggleEditableField(element: HTMLElement): void {
        if (this.isEditing) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = element.textContent || '';
            input.className = 'looking-for-item editable-input';
            
            // Store the original element
            const id = Math.random().toString(36).substr(2, 9);
            this.editableElements.set(id, element.cloneNode(true) as HTMLElement);
            input.dataset.elementId = id;
            
            element.parentNode?.replaceChild(input, element);
        } else {
            if (element instanceof HTMLInputElement) {
                const input = element;
                const originalElement = this.editableElements.get(input.dataset.elementId || '');
                
                if (originalElement) {
                    const newElement = originalElement.cloneNode(true) as HTMLElement;
                    newElement.textContent = input.value || newElement.textContent;
                    input.parentNode?.replaceChild(newElement, input);
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BuilderInterface();
});