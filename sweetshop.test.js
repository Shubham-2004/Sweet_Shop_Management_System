

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

    });