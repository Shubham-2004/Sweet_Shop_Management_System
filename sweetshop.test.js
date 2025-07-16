
const { Sweet, SweetShop } = require('./sweetshop.js')
describe('Sweet Class', () => {
    // Test valid sweet creation
    test('should create a valid sweet', () => {
        const sweet = new Sweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20);
        expect(sweet.id).toBe(1001);
        expect(sweet.name).toBe('Kaju Katli');
        expect(sweet.category).toBe('Nut-Based');
        expect(sweet.price).toBe(50);
        expect(sweet.quantity).toBe(20);
    });

    // Test invalid sweet data throws error
    test('should throw error for invalid data', () => {
        expect(() => new Sweet(null, 'Test', 'Category', 10, 5)).toThrow('Invalid sweet data');
        expect(() => new Sweet(1, '', 'Category', 10, 5)).toThrow('Invalid sweet data');
        expect(() => new Sweet(1, 'Test', '', 10, 5)).toThrow('Invalid sweet data');
        expect(() => new Sweet(1, 'Test', 'Category', -10, 5)).toThrow('Invalid sweet data');
        expect(() => new Sweet(1, 'Test', 'Category', 10, -5)).toThrow('Invalid sweet data');
    });
});

// Test suite for the SweetShop class
describe('SweetShop Class', () => {
    // Test adding a sweet
    test('should add a sweet successfully', () => {
        const shop = new SweetShop();
        const sweet = shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
        expect(sweet.name).toBe('Kaju Katli');
        expect(sweet.category).toBe('Nut-Based');
        expect(sweet.price).toBe(50);
        expect(sweet.quantity).toBe(20);
        expect(sweet.id).toBeGreaterThanOrEqual(1001);
    });

    // Test auto-generated unique IDs
    test('should auto-generate unique IDs', () => {
        const shop = new SweetShop();
        const sweet1 = shop.addSweet('Sweet 1', 'Category 1', 10, 5);
        const sweet2 = shop.addSweet('Sweet 2', 'Category 2', 20, 10);
        expect(sweet2.id).toBeGreaterThan(sweet1.id);
    });

    // Test invalid sweet data throws error
    test('should throw error for invalid sweet data', () => {
        const shop = new SweetShop();
        expect(() => shop.addSweet('', 'Category', 10, 5)).toThrow('Invalid sweet data');
        expect(() => shop.addSweet('Name', '', 10, 5)).toThrow('Invalid sweet data');
        expect(() => shop.addSweet('Name', 'Category', -10, 5)).toThrow('Invalid sweet data');
        expect(() => shop.addSweet('Name', 'Category', 10, -5)).toThrow('Invalid sweet data');
    });

    // Test deleting a sweet
    test('should delete a sweet successfully', () => {
        const shop = new SweetShop();
        const sweet = shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
        const deleted = shop.deleteSweet(sweet.id);
        expect(deleted.name).toBe('Kaju Katli');
        expect(() => shop.getSweet(sweet.id)).toThrow('Sweet not found');
    });

    // Test deleting a non-existent sweet throws error
    test('should throw error when deleting non-existent sweet', () => {
        const shop = new SweetShop();
        expect(() => shop.deleteSweet(999)).toThrow('Sweet not found');
    });

    // Test getting all sweets
    test('should get all sweets', () => {
        const shop = new SweetShop();
        shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15);
        const sweets = shop.getAllSweets();
        expect(sweets.length).toBe(2);
    });

    // Test getting a sweet by ID
    test('should get specific sweet by ID', () => {
        const shop = new SweetShop();
        const sweet = shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
        const retrieved = shop.getSweet(sweet.id);
        expect(retrieved.name).toBe('Kaju Katli');
    });

    // Test getting a non-existent sweet by ID throws error
    test('should throw error for non-existent sweet ID', () => {
        const shop = new SweetShop();
        expect(() => shop.getSweet(999)).toThrow('Sweet not found');
    });

    // Test searching sweets by name
    test('should search by name', () => {
        const shop = new SweetShop();
        shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15);
        shop.addSweet('Gulab Jamun', 'Milk-Based', 10, 50);
        const results = shop.searchByName('Kaju');
        expect(results.length).toBe(1);
        expect(results[0].name).toBe('Kaju Katli');
    });

    // Test searching sweets by category
    test('should search by category', () => {
        const shop = new SweetShop();
        shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15);
        shop.addSweet('Gulab Jamun', 'Milk-Based', 10, 50);
        const results = shop.searchByCategory('Milk');
        expect(results.length).toBe(1);
        expect(results[0].name).toBe('Gulab Jamun');
    });

    // Test searching sweets by price range
    test('should search by price range', () => {
        const shop = new SweetShop();
        shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15);
        shop.addSweet('Gulab Jamun', 'Milk-Based', 10, 50);
        const results = shop.searchByPriceRange(20, 40);
        expect(results.length).toBe(1);
        expect(results[0].name).toBe('Gajar Halwa');
    });

    // Test sorting sweets by name ascending
    test('should sort by name ascending', () => {
        const shop = new SweetShop();
        shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15);
        shop.addSweet('Gulab Jamun', 'Milk-Based', 10, 50);
        const sorted = shop.sortByName(true);
        expect(sorted[0].name).toBe('Gajar Halwa');
        expect(sorted[1].name).toBe('Gulab Jamun');
        expect(sorted[2].name).toBe('Kaju Katli');
    });

    // Test sorting sweets by price ascending
    test('should sort by price ascending', () => {
        const shop = new SweetShop();
        shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
        shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15);
        shop.addSweet('Gulab Jamun', 'Milk-Based', 10, 50);
        const sorted = shop.sortByPrice(true);
        expect(sorted[0].price).toBe(10);
        expect(sorted[1].price).toBe(30);
        expect(sorted[2].price).toBe(50);
    });

    // Test purchasing sweets
    test('should purchase sweets successfully', () => {
        const shop = new SweetShop();
        const sweet = shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
        const purchase = shop.purchaseSweet(sweet.id, 5);
        expect(purchase.purchased).toBe(5);
        expect(purchase.totalCost).toBe(250);
        expect(sweet.quantity).toBe(15);
    });

    // Test purchasing more than available stock throws error
    test('should throw error for insufficient stock', () => {
        const shop = new SweetShop();
        const sweet = shop.addSweet('Kaju Katli', 'Nut-Based', 50, 5);
        expect(() => shop.purchaseSweet(sweet.id, 10)).toThrow('Insufficient stock');
    });

    // Test purchasing with invalid quantity throws error
    test('should throw error for invalid purchase quantity', () => {
        const shop = new SweetShop();
        const sweet = shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
        expect(() => shop.purchaseSweet(sweet.id, 0)).toThrow('Purchase quantity must be greater than 0');
        expect(() => shop.purchaseSweet(sweet.id, -5)).toThrow('Purchase quantity must be greater than 0');
    });

    // Test restocking sweets
    test('should restock sweets successfully', () => {
        const shop = new SweetShop();
        const sweet = shop.addSweet('Kaju Katli', 'Nut-Based', 50, 10);
        const restocked = shop.restockSweet(sweet.id, 15);
        expect(restocked.quantity).toBe(25);
    });

    // Test restocking with invalid quantity throws error
    test('should throw error for invalid restock quantity', () => {
        const shop = new SweetShop();
        const sweet = shop.addSweet('Kaju Katli', 'Nut-Based', 50, 10);
        expect(() => shop.restockSweet(sweet.id, 0)).toThrow('Restock quantity must be greater than 0');
        expect(() => shop.restockSweet(sweet.id, -5)).toThrow('Restock quantity must be greater than 0');
    });

    // Test getting low stock sweets
    test('should get low stock sweets', () => {
        const shop = new SweetShop();
        shop.addSweet('Kaju Katli', 'Nut-Based', 50, 3);
        shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15);
        shop.addSweet('Gulab Jamun', 'Milk-Based', 10, 2);
        const lowStock = shop.getLowStockSweets(5);
        expect(lowStock.length).toBe(2);
    });

        // Test calculating total inventory value
        test('should calculate total inventory value', () => {
            const shop = new SweetShop();
            shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20); 
            shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15); 
            shop.addSweet('Gulab Jamun', 'Milk-Based', 10, 50); 
            const totalValue = shop.getTotalInventoryValue();
            expect(totalValue).toBe(1950);
        });
    });