class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(description, testFunction) {
        this.tests.push({ description, testFunction });
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, but got ${actual}`);
        }
    }

    assertThrows(fn, expectedError, message) {
        try {
            fn();
            throw new Error(message || 'Expected function to throw an error');
        } catch (error) {
            if (expectedError && !error.message.includes(expectedError)) {
                throw new Error(`Expected error containing "${expectedError}", but got "${error.message}"`);
            }
        }
    }

    run() {
        console.log('🧪 Running Sweet Shop Management System Tests...\n');
        
        this.tests.forEach(({ description, testFunction }) => {
            try {
                testFunction();
                console.log(`✅ ${description}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${description}`);
                console.log(`   Error: ${error.message}`);
                this.failed++;
            }
        });

        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        console.log(`📈 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
    }
}

// Create test runner instance
const runner = new TestRunner();

// Test Suite for Sweet Class
runner.test('Sweet - should create a valid sweet', () => {
    const sweet = new Sweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20);
    runner.assertEqual(sweet.id, 1001);
    runner.assertEqual(sweet.name, 'Kaju Katli');
    runner.assertEqual(sweet.category, 'Nut-Based');
    runner.assertEqual(sweet.price, 50);
    runner.assertEqual(sweet.quantity, 20);
});

runner.test('Sweet - should throw error for invalid data', () => {
    runner.assertThrows(() => new Sweet(null, 'Test', 'Category', 10, 5), 'Invalid sweet data');
    runner.assertThrows(() => new Sweet(1, '', 'Category', 10, 5), 'Invalid sweet data');
    runner.assertThrows(() => new Sweet(1, 'Test', '', 10, 5), 'Invalid sweet data');
    runner.assertThrows(() => new Sweet(1, 'Test', 'Category', -10, 5), 'Invalid sweet data');
    runner.assertThrows(() => new Sweet(1, 'Test', 'Category', 10, -5), 'Invalid sweet data');
});

// Test Suite for SweetShop - Add Sweets
runner.test('SweetShop - should add a sweet successfully', () => {
    const shop = new SweetShop();
    const sweet = shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
    
    runner.assertEqual(sweet.name, 'Kaju Katli');
    runner.assertEqual(sweet.category, 'Nut-Based');
    runner.assertEqual(sweet.price, 50);
    runner.assertEqual(sweet.quantity, 20);
    runner.assert(sweet.id >= 1001, 'Sweet should have valid ID');
});

runner.test('SweetShop - should auto-generate unique IDs', () => {
    const shop = new SweetShop();
    const sweet1 = shop.addSweet('Sweet 1', 'Category 1', 10, 5);
    const sweet2 = shop.addSweet('Sweet 2', 'Category 2', 20, 10);
    
    runner.assert(sweet2.id > sweet1.id, 'IDs should be unique and incrementing');
});

runner.test('SweetShop - should throw error for invalid sweet data', () => {
    const shop = new SweetShop();
    runner.assertThrows(() => shop.addSweet('', 'Category', 10, 5), 'Invalid sweet data');
    runner.assertThrows(() => shop.addSweet('Name', '', 10, 5), 'Invalid sweet data');
    runner.assertThrows(() => shop.addSweet('Name', 'Category', -10, 5), 'Invalid sweet data');
    runner.assertThrows(() => shop.addSweet('Name', 'Category', 10, -5), 'Invalid sweet data');
});

// Test Suite for SweetShop - Delete Sweets
runner.test('SweetShop - should delete a sweet successfully', () => {
    const shop = new SweetShop();
    const sweet = shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
    const deleted = shop.deleteSweet(sweet.id);
    
    runner.assertEqual(deleted.name, 'Kaju Katli');
    runner.assertThrows(() => shop.getSweet(sweet.id), 'Sweet not found');
});

runner.test('SweetShop - should throw error when deleting non-existent sweet', () => {
    const shop = new SweetShop();
    runner.assertThrows(() => shop.deleteSweet(999), 'Sweet not found');
});

// Test Suite for SweetShop - View Sweets
runner.test('SweetShop - should get all sweets', () => {
    const shop = new SweetShop();
    shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
    shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15);
    
    const sweets = shop.getAllSweets();
    runner.assertEqual(sweets.length, 2);
});

runner.test('SweetShop - should get specific sweet by ID', () => {
    const shop = new SweetShop();
    const sweet = shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
    const retrieved = shop.getSweet(sweet.id);
    
    runner.assertEqual(retrieved.name, 'Kaju Katli');
});

runner.test('SweetShop - should throw error for non-existent sweet ID', () => {
    const shop = new SweetShop();
    runner.assertThrows(() => shop.getSweet(999), 'Sweet not found');
});

// Test Suite for Search Features
runner.test('SweetShop - should search by name', () => {
    const shop = new SweetShop();
    shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
    shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15);
    shop.addSweet('Gulab Jamun', 'Milk-Based', 10, 50);
    
    const results = shop.searchByName('Kaju');
    runner.assertEqual(results.length, 1);
    runner.assertEqual(results[0].name, 'Kaju Katli');
});

runner.test('SweetShop - should search by category', () => {
    const shop = new SweetShop();
    shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
    shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15);
    shop.addSweet('Gulab Jamun', 'Milk-Based', 10, 50);
    
    const results = shop.searchByCategory('Milk');
    runner.assertEqual(results.length, 1);
    runner.assertEqual(results[0].name, 'Gulab Jamun');
});

runner.test('SweetShop - should search by price range', () => {
    const shop = new SweetShop();
    shop.addSweet('Kaju Katli', 'Nut-Based', 50, 20);
    shop.addSweet('Gajar Halwa', 'Vegetable-Based', 30, 15);
    shop.addSweet('Gulab Jamun', 'Milk-Based', 10, 50);
    
    const results = shop.searchByPriceRange(20, 40);
    runner.assertEqual(results.length, 1);
    runner.assertEqual(results[0].name, 'Gajar Halwa');
});


// Run all tests
runner.run();