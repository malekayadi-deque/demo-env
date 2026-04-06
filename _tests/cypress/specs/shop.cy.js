describe('Shop Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/shop');
    cy.get('#products-grid', { timeout: 10000 }).should('be.visible');
  });

  it('should render the shop page with a product grid', () => {
    cy.get('section.shop-main').should('be.visible');
    cy.get('#products-grid').should('be.visible');
    cy.get('#products-grid .product-card-wrapper').should('have.length.greaterThan', 0);
  });

  it('should allow sorting products', () => {
    cy.get('select[aria-label="Sort Items"]').should('be.visible');
    cy.get('select[aria-label="Sort Items"]').select('5', { force: true });
    cy.get('select[aria-label="Sort Items"]').should('have.value', '5');
  });

  it('should change product grid layout based on selected columns', () => {
    cy.get('.col-size button').should('have.length', 3);
    cy.get('.col-size button').eq(2).click();
    cy.get('#products-grid').should('have.class', 'row-cols-lg-4');
  });

  it('should add a product to the cart', () => {
    cy.get('.product-card').first().find('.pc__atc').first().click({ force: true });
    cy.get('.product-card').first().find('.pc__atc').first().should('have.text', 'Already Added');
  });

  it('should navigate to a product details page when clicking a product title', () => {
    cy.get('.product-card .pc__info h6.pc__title a').first().should('be.visible');
    cy.get('.product-card .pc__info h6.pc__title a').first().click({ force: true });
    cy.url().should('match', /\/product\/\d+/);
  });

  it('should toggle wishlist status for a product', () => {
    cy.get('.product-card .pc__btn-wl').first().should('be.visible');
    cy.get('.product-card .pc__btn-wl').first().click({ force: true });
    cy.get('.product-card .pc__btn-wl').first().should('have.class', 'active');
    cy.get('.product-card .pc__btn-wl').first().click({ force: true });
    cy.get('.product-card .pc__btn-wl').first().should('not.have.class', 'active');
  });

  it('should display pagination controls', () => {
    cy.get('.pagination').should('be.visible');
    cy.get('.pagination a').should('have.length.greaterThan', 0);
  });
});
