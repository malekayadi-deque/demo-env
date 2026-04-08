describe('Product Details Page', () => {
  const product = {
    id: 249,
    title: 'End Grain Cutting Board',
    price: 120,
  };

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(`/product/${product.id}`);
    cy.get('section.product-single', { timeout: 10000 }).should('be.visible');
  });

  it('should display product details correctly', () => {
    cy.get('section.product-single .product-single__name').first().should('have.text', product.title);
    cy.get('section.product-single .product-single__price .current-price').first().should('have.text', `$${product.price}`);
  });

  it('should display product rating and reviews', () => {
    cy.get('.product-single__rating .reviews-group').should('be.visible');
    cy.get('.product-single__rating .reviews-note').should('contain.text', '8k+ reviews');
  });

  it('should update quantity when using the controls', () => {
    cy.get('section.product-single input[name="quantity"]').should('have.value', '1');
    cy.get('section.product-single .qty-control__increase').click();
    cy.get('section.product-single input[name="quantity"]').should('have.value', '2');
    cy.get('section.product-single .qty-control__reduce').click();
    cy.get('section.product-single input[name="quantity"]').should('have.value', '1');
  });

  it('should add the product to the cart', () => {
    cy.get('section.product-single .btn-addtocart').should('have.text', 'Add to Cart');
    cy.get('section.product-single .btn-addtocart').click({ force: true });
    cy.get('section.product-single .btn-addtocart').should('have.text', 'Already Added');
  });

  it('should switch between product tabs', () => {
    cy.get('section.product-single #tab-additional-info-tab').click({ force: true });
    cy.get('section.product-single #tab-additional-info').should('have.class', 'active');

    cy.get('section.product-single #tab-reviews-tab').click({ force: true });
    cy.get('section.product-single #tab-reviews').should('have.class', 'active');

    cy.get('section.product-single #tab-description-tab').click({ force: true });
    cy.get('section.product-single #tab-description').should('have.class', 'active');
  });

  it('should navigate to previous and next products', () => {
    cy.get('.product-single__prev-next a').contains('Prev').should('be.visible');
    cy.get('.product-single__prev-next a').contains('Prev').click({ force: true });
    cy.url().should('match', /\/product\/\d+/);

    cy.clearLocalStorage();
    cy.visit(`/product/${product.id}`);
    cy.get('section.product-single', { timeout: 10000 }).should('be.visible');
    cy.get('.product-single__prev-next a').contains('Next').should('be.visible');
    cy.get('.product-single__prev-next a').contains('Next').click({ force: true });
    cy.url().should('match', /\/product\/\d+/);
  });
});
