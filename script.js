
class Sweet {
    constructor(id, name, category, price, quantity) {
        if (!id || !name || !category || price < 0 || quantity < 0) {
            throw new Error('Invalid sweet data');
        }
        
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
    }
}

class SweetShop {
    constructor() {
        this.sweets = new Map();
        this.nextId = 1001;
    }

    addSweet(name, category, price, quantity) {
        if (!name || !category || price < 0 || quantity < 0) {
            throw new Error('Invalid sweet data');
        }

        const id = this.nextId++;
        const sweet = new Sweet(id, name, category, price, quantity);
        this.sweets.set(id, sweet);
        return sweet;
    }

    deleteSweet(id) {
        if (!this.sweets.has(id)) {
            throw new Error('Sweet not found');
        }
        
        const deleted = this.sweets.get(id);
        this.sweets.delete(id);
        return deleted;
    }

    getAllSweets() {
        return Array.from(this.sweets.values());
    }

    getSweet(id) {
        const sweet = this.sweets.get(id);
        if (!sweet) {
            throw new Error('Sweet not found');
        }
        return sweet;
    }

    searchByName(name) {
        return this.getAllSweets().filter(sweet => 
            sweet.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    searchByCategory(category) {
        return this.getAllSweets().filter(sweet => 
            sweet.category.toLowerCase().includes(category.toLowerCase())
        );
    }

    searchByPriceRange(minPrice, maxPrice) {
        return this.getAllSweets().filter(sweet => 
            sweet.price >= minPrice && sweet.price <= maxPrice
        );
    }

    sortByName(ascending = true) {
        return this.getAllSweets().sort((a, b) => {
            return ascending ? 
                a.name.localeCompare(b.name) : 
                b.name.localeCompare(a.name);
        });
    }

    sortByPrice(ascending = true) {
        return this.getAllSweets().sort((a, b) => {
            return ascending ? a.price - b.price : b.price - a.price;
        });
    }

    sortByQuantity(ascending = true) {
        return this.getAllSweets().sort((a, b) => {
            return ascending ? a.quantity - b.quantity : b.quantity - a.quantity;
        });
    }

    sortByCategory(ascending = true) {
        return this.getAllSweets().sort((a, b) => {
            return ascending ? 
                a.category.localeCompare(b.category) : 
                b.category.localeCompare(a.category);
        });
    }

    purchaseSweet(id, quantity) {
        const sweet = this.getSweet(id);
        
        if (quantity <= 0) {
            throw new Error('Purchase quantity must be greater than 0');
        }
        
        if (sweet.quantity < quantity) {
            throw new Error('Insufficient stock available');
        }
        
        sweet.quantity -= quantity;
        return {
            sweet: sweet,
            purchased: quantity,
            totalCost: sweet.price * quantity
        };
    }

    restockSweet(id, quantity) {
        const sweet = this.getSweet(id);
        
        if (quantity <= 0) {
            throw new Error('Restock quantity must be greater than 0');
        }
        
        sweet.quantity += quantity;
        return sweet;
    }

    getLowStockSweets(threshold = 5) {
        return this.getAllSweets().filter(sweet => sweet.quantity <= threshold);
    }

    getTotalInventoryValue() {
        return this.getAllSweets().reduce((total, sweet) => {
            return total + (sweet.price * sweet.quantity);
        }, 0);
    }

    clearAllSweets() {
        this.sweets.clear();
        this.nextId = 1001;
    }
}

// Global shop instance
const shop = new SweetShop();
let currentSweets = [];
let currentPurchaseId = null;
let currentRestockId = null;

// UI Functions
function showMessage(message, type = 'success') {
    const container = document.getElementById('message-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'alert');
    container.appendChild(messageDiv);
    
    setTimeout(() => {
        if (container.contains(messageDiv)) {
            container.removeChild(messageDiv);
        }
    }, 3000);
}

function updateStats() {
    const totalSweets = shop.getAllSweets().length;
    const totalValue = shop.getTotalInventoryValue();
    const lowStock = shop.getLowStockSweets().length;
    
    document.getElementById('total-sweets').textContent = totalSweets;
    document.getElementById('total-value').textContent = `₹${totalValue.toFixed(2)}`;
    document.getElementById('low-stock').textContent = lowStock;
}

function renderSweets(sweets = null) {
    const sweetsToRender = sweets || shop.getAllSweets();
    currentSweets = sweetsToRender;
    const grid = document.getElementById('inventory-grid');
    
    if (sweetsToRender.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>No sweets found</h3>
                <p>Add some sweets to get started!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = sweetsToRender.map(sweet => {
        const stockClass = sweet.quantity <= 5 ? 'low-stock' : '';
        return `
            <article class="sweet-card">
                <h4>${sweet.name}</h4>
                <div class="sweet-info">
                    <span><strong>Category:</strong> ${sweet.category}</span>
                    <span><strong>Price:</strong> ₹${sweet.price}</span>
                    <span><strong>ID:</strong> ${sweet.id}</span>
                    <span class="${stockClass}"><strong>Stock:</strong> ${sweet.quantity}</span>
                </div>
                <div class="sweet-actions">
                    <button class="btn btn-primary" onclick="openPurchaseModal(${sweet.id})" aria-label="Purchase ${sweet.name}">
                        🛒 Buy
                    </button>
                    <button class="btn btn-success" onclick="openRestockModal(${sweet.id})" aria-label="Restock ${sweet.name}">
                        📦 Restock
                    </button>
                    <button class="btn btn-danger" onclick="deleteSweet(${sweet.id})" aria-label="Delete ${sweet.name}">
                        🗑️ Delete
                    </button>
                </div>
            </article>
        `;
    }).join('');
}

function addSweet() {
    const name = document.getElementById('add-name').value.trim();
    const category = document.getElementById('add-category').value;
    const price = parseFloat(document.getElementById('add-price').value);
    const quantity = parseInt(document.getElementById('add-quantity').value);
    
    if (!name || !category || isNaN(price) || isNaN(quantity) || price < 0 || quantity < 0) {
        showMessage('Please fill all fields with valid values', 'error');
        return;
    }
    
    try {
        const sweet = shop.addSweet(name, category, price, quantity);
        showMessage(`Sweet "${sweet.name}" added successfully!`);
        
        // Clear form
        document.getElementById('add-name').value = '';
        document.getElementById('add-category').value = '';
        document.getElementById('add-price').value = '';
        document.getElementById('add-quantity').value = '';
        
        renderSweets();
        updateStats();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function deleteSweet(id) {
    if (confirm('Are you sure you want to delete this sweet?')) {
        try {
            const deleted = shop.deleteSweet(id);
            showMessage(`Sweet "${deleted.name}" deleted successfully!`);
            renderSweets();
            updateStats();
        } catch (error) {
            showMessage(error.message, 'error');
        }
    }
}

function searchSweets() {
    const name = document.getElementById('search-name').value.trim();
    const category = document.getElementById('search-category').value;
    const minPrice = parseFloat(document.getElementById('search-min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('search-max-price').value) || Infinity;
    
    let results = shop.getAllSweets();
    
    if (name) {
        results = results.filter(sweet => 
            sweet.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    
    if (category) {
        results = results.filter(sweet => 
            sweet.category.toLowerCase().includes(category.toLowerCase())
        );
    }
    
    if (minPrice > 0 || maxPrice < Infinity) {
        results = results.filter(sweet => 
            sweet.price >= minPrice && sweet.price <= maxPrice
        );
    }
    
    renderSweets(results);
    showMessage(`Found ${results.length} sweet(s) matching your search criteria`);
}

function sortSweets() {
    const sortBy = document.getElementById('sort-by').value;
    const sortOrder = document.getElementById('sort-order').value;
    const ascending = sortOrder === 'asc';
    
    let sorted;
    switch (sortBy) {
        case 'name':
            sorted = shop.sortByName(ascending);
            break;
        case 'price':
            sorted = shop.sortByPrice(ascending);
            break;
        case 'quantity':
            sorted = shop.sortByQuantity(ascending);
            break;
        case 'category':
            sorted = shop.sortByCategory(ascending);
            break;
        default:
            sorted = shop.getAllSweets();
    }
    
    renderSweets(sorted);
    showMessage(`Sweets sorted by ${sortBy} (${sortOrder}ending)`);
}

function showLowStock() {
    const lowStock = shop.getLowStockSweets();
    renderSweets(lowStock);
    showMessage(`Showing ${lowStock.length} low stock item(s)`);
}

function showAllSweets() {
    renderSweets();
    showMessage('Showing all sweets');
}

function clearAllSweets() {
    if (confirm('Are you sure you want to clear all sweets? This action cannot be undone.')) {
        shop.clearAllSweets();
        renderSweets();
        updateStats();
        showMessage('All sweets cleared successfully!');
    }
}

function loadSampleData() {
    try {
        shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15);
        shop.addSweet('Gulab Jamun', 'Milk-Based', 10, 50);
        shop.addSweet('Rasgulla', 'Milk-Based', 8, 30);
        shop.addSweet('Chocolate Barfi', 'Chocolate', 60, 12);
        shop.addSweet('Jalebi', 'Candy', 25, 25);
        shop.addSweet('Motichoor Ladoo', 'Nut-Based', 40, 18);
        shop.addSweet('Peda', 'Milk-Based', 15, 35);
        
        renderSweets();
        updateStats();
        showMessage('Sample data loaded successfully!');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Purchase Modal Functions
function openPurchaseModal(id) {
    try {
        const sweet = shop.getSweet(id);
        currentPurchaseId = id;
        
        document.getElementById('purchase-sweet-name').textContent = sweet.name;
        document.getElementById('purchase-quantity').value = 1;
        document.getElementById('purchase-quantity').max = sweet.quantity;
        updatePurchaseTotal();
        
        document.getElementById('purchase-modal').style.display = 'block';
        document.getElementById('purchase-quantity').focus();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function updatePurchaseTotal() {
    try {
        const sweet = shop.getSweet(currentPurchaseId);
        const quantity = parseInt(document.getElementById('purchase-quantity').value) || 0;
        const total = sweet.price * quantity;
        document.getElementById('purchase-total').textContent = `Total: ₹${total.toFixed(2)}`;
    } catch (error) {
        console.error('Error updating purchase total:', error);
    }
}

function confirmPurchase() {
    const quantity = parseInt(document.getElementById('purchase-quantity').value);
    
    try {
        const purchase = shop.purchaseSweet(currentPurchaseId, quantity);
        showMessage(`Purchased ${purchase.purchased} ${purchase.sweet.name}(s) for ₹${purchase.totalCost.toFixed(2)}`);
        closePurchaseModal();
        renderSweets();
        updateStats();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function closePurchaseModal() {
    document.getElementById('purchase-modal').style.display = 'none';
    currentPurchaseId = null;
}

// Restock Modal Functions
function openRestockModal(id) {
    try {
        const sweet = shop.getSweet(id);
        currentRestockId = id;
        
        document.getElementById('restock-sweet-name').textContent = sweet.name;
        document.getElementById('restock-quantity').value = 10;
        
        document.getElementById('restock-modal').style.display = 'block';
        document.getElementById('restock-quantity').focus();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function confirmRestock() {
    const quantity = parseInt(document.getElementById('restock-quantity').value);
    
    try {
        const sweet = shop.restockSweet(currentRestockId, quantity);
        showMessage(`Restocked ${quantity} ${sweet.name}(s). New stock: ${sweet.quantity}`);
        closeRestockModal();
        renderSweets();
        updateStats();
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function closeRestockModal() {
    document.getElementById('restock-modal').style.display = 'none';
    currentRestockId = null;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Purchase quantity input listener
    document.getElementById('purchase-quantity').addEventListener('input', updatePurchaseTotal);
    
    // Keyboard navigation for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePurchaseModal();
            closeRestockModal();
        }
    });
    
    // Initialize the application
    updateStats();
    renderSweets();
    showMessage('Welcome to Sweet Shop Management System!');
});