
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

    // Add a new sweet to the shop
    addSweet(name, category, price, quantity) {
        if (!name || !category || price < 0 || quantity < 0) {
            throw new Error('Invalid sweet data');
        }

        const id = this.nextId++;
        const sweet = new Sweet(id, name, category, price, quantity);
        this.sweets.set(id, sweet);
        return sweet;
    }

    // Delete a sweet from the shop
    deleteSweet(id) {
        if (!this.sweets.has(id)) {
            throw new Error('Sweet not found');
        }
        
        const deleted = this.sweets.get(id);
        this.sweets.delete(id);
        return deleted;
    }

    // Get all sweets in the shop
    getAllSweets() {
        return Array.from(this.sweets.values());
    }

    // Get a specific sweet by ID
    getSweet(id) {
        const sweet = this.sweets.get(id);
        if (!sweet) {
            throw new Error('Sweet not found');
        }
        return sweet;
    }

    // Search sweets by name
    searchByName(name) {
        return this.getAllSweets().filter(sweet => 
            sweet.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    // Search sweets by category
    searchByCategory(category) {
        return this.getAllSweets().filter(sweet => 
            sweet.category.toLowerCase().includes(category.toLowerCase())
        );
    }

    // Search sweets by price range
    searchByPriceRange(minPrice, maxPrice) {
        return this.getAllSweets().filter(sweet => 
            sweet.price >= minPrice && sweet.price <= maxPrice
        );
    }

    // Sort sweets by name
    sortByName(ascending = true) {
        const sorted = this.getAllSweets().sort((a, b) => {
            return ascending ? 
                a.name.localeCompare(b.name) : 
                b.name.localeCompare(a.name);
        });
        return sorted;
    }

    // Sort sweets by price
    sortByPrice(ascending = true) {
        const sorted = this.getAllSweets().sort((a, b) => {
            return ascending ? a.price - b.price : b.price - a.price;
        });
        return sorted;
    }

    // Purchase sweets (decrease quantity)
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

    // Restock sweets (increase quantity)
    restockSweet(id, quantity) {
        const sweet = this.getSweet(id);
        
        if (quantity <= 0) {
            throw new Error('Restock quantity must be greater than 0');
        }
        
        sweet.quantity += quantity;
        return sweet;
    }

    // Get sweets with low stock (optional utility method)
    getLowStockSweets(threshold = 5) {
        return this.getAllSweets().filter(sweet => sweet.quantity <= threshold);
    }

    // Get total value of inventory
    getTotalInventoryValue() {
        return this.getAllSweets().reduce((total, sweet) => {
            return total + (sweet.price * sweet.quantity);
        }, 0);
    }

    // Clear all sweets (utility for testing)
    clearAllSweets() {
        this.sweets.clear();
        this.nextId = 1001;
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Sweet, SweetShop };
} else {
    window.Sweet = Sweet;
    window.SweetShop = SweetShop;
}