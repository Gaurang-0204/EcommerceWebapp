describe('Real-Time Inventory System E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/products');
  });

  it('should display products with real-time inventory', () => {
    // Check products are loaded
    cy.contains('Our Products').should('be.visible');
    
    // Check connection status
    cy.get('[data-testid="connection-status"]').should('contain', 'Connected');
    
    // Check stock badges are displayed
    cy.get('[data-testid="stock-badge"]').should('have.length.greaterThan', 0);
  });

  it('should show out of stock overlay', () => {
    // Simulate out of stock via API
    cy.intercept('GET', '**/api/v1/events/inventory/', {
      statusCode: 200,
      body: {
        event_type: 'out_of_stock',
        product_name: 'Test Product',
        new_quantity: 0,
      },
    });

    // Check overlay appears
    cy.contains('Out of Stock').should('be.visible');
  });

  it('should disable purchase for out of stock items', () => {
    cy.get('[data-testid="add-to-cart-btn"]').first().as('addBtn');
    cy.get('@addBtn').should('not.be.disabled');

    // Change status to out of stock
    cy.intercept('GET', '**/api/v1/events/inventory/', {
      statusCode: 200,
      body: {
        event_type: 'out_of_stock',
        product_id: '1',
        new_quantity: 0,
      },
    });

    cy.get('@addBtn').should('be.disabled');
  });

  it('should show low stock warning', () => {
    cy.intercept('GET', '**/api/v1/events/inventory/', {
      statusCode: 200,
      body: {
        event_type: 'low_stock_warning',
        product_name: 'Test Product',
        new_quantity: 3,
      },
    });

    cy.contains('Low Stock Warning').should('be.visible');
    cy.contains('Only 3 item').should('be.visible');
  });

  it('should handle real-time updates', () => {
    // Start listening for SSE updates
    cy.intercept('GET', '**/api/v1/events/inventory/', {
      statusCode: 200,
      body: [
        { event_type: 'stock_updated', new_quantity: 10 },
        { event_type: 'stock_updated', new_quantity: 5 },
        { event_type: 'out_of_stock', new_quantity: 0 },
      ],
    }).as('inventoryUpdates');

    // Wait for updates
    cy.wait('@inventoryUpdates');

    // Check that UI updated
    cy.get('[data-testid="stock-badge"]').should('contain', '0');
  });
});
