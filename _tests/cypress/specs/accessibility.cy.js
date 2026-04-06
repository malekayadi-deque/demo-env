describe('Accessibility monitoring — axe Watcher', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('home page loads', () => {
    cy.visit('/');
    cy.get('main, #__next, body').should('be.visible');
  });

  it('shop page loads with product grid', () => {
    cy.visit('/shop');
    cy.get('section.shop-main').should('be.visible');
    cy.get('#products-grid').should('be.visible');
    cy.get('#products-grid .product-card-wrapper').should('have.length.greaterThan', 0);
  });

  it('shop cart page loads after adding a product', () => {
    // Add product 249 to cart via the shop page first
    cy.visit('/shop');
    cy.get('#products-grid .product-card-wrapper').first().within(() => {
      cy.get('.pc__atc').first().click({ force: true });
    });
    cy.visit('/shop_cart');
    cy.get('.cart-table', { timeout: 10000 }).should('be.visible');
  });

  it('login/register page loads with login tab active', () => {
    cy.visit('/login_register');
    cy.get('#login-tab').should('have.class', 'active');
    cy.get('#tab-item-login').should('be.visible');
  });
});
