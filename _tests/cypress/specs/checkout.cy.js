describe('Checkout Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/product/249');
    cy.get('section.product-single', { timeout: 10000 }).should('be.visible');
    cy.get('section.product-single .btn-addtocart', { timeout: 10000 }).should('be.visible');
    cy.get('section.product-single .btn-addtocart').click({ force: true });
    cy.visit('/shop_checkout');
    cy.get('#checkout_first_name', { timeout: 10000 }).should('be.visible');
  });

  it('should display the billing details form', () => {
    cy.get('#checkout_first_name').should('be.visible');
    cy.get('#checkout_first_name').type('John', { force: true });
    cy.get('#checkout_first_name').should('have.value', 'John');
    cy.get('#checkout_last_name').should('be.visible');
    cy.get('#checkout_last_name').type('Doe', { force: true });
    cy.get('#checkout_last_name').should('have.value', 'Doe');
  });

  it('should handle the country/region dropdown', () => {
    cy.get('#search-dropdown').should('be.visible');
    cy.get('#search-dropdown').click({ force: true });
    cy.get('ul.search-suggestion').should('be.visible');
    cy.get('ul.search-suggestion').contains('United States').click({ force: true });
    cy.get('#search-dropdown').should('have.value', 'United States');
  });
});
