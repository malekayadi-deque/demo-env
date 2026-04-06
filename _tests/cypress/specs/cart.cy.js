describe('Shopping Cart Page', () => {
  const product = {
    title: 'End Grain Cutting Board',
    price: 120,
    quantity: 1,
  };
  const totalPrice = product.price * product.quantity;

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/product/249');
    cy.get('section.product-single', { timeout: 10000 }).should('be.visible');
    cy.get('section.product-single .btn-addtocart', { timeout: 10000 }).should('be.visible');
    cy.get('section.product-single .btn-addtocart').click({ force: true });
    cy.visit('/shop_cart');
    cy.get('.cart-table', { timeout: 10000 }).should('be.visible');
  });

  it('should display cart items with correct details', () => {
    cy.get('.cart-table tbody tr').should('have.length', 1);
    cy.get('.cart-table tbody tr').first().within(() => {
      cy.get('h4').should('have.text', product.title);
      cy.get('.shopping-cart__product-price').should('have.text', `$${product.price}`);
      cy.get('input[name="quantity"]').should('have.value', `${product.quantity}`);
      cy.get('.shopping-cart__subtotal').should('have.text', `$${totalPrice}`);
    });
  });

  it('should update quantity of a product', () => {
    cy.get('input[name="quantity"]').first().should('be.visible');
    cy.get('.qty-control__increase').first().should('be.visible').click();
    cy.get('input[name="quantity"]').first().should('have.value', '2');
    cy.get('.qty-control__reduce').first().click();
    cy.get('input[name="quantity"]').first().should('have.value', '1');
  });

  it('should remove a product from the cart', () => {
    cy.get('.remove-cart').first().should('be.visible').click();
    cy.get('.cart-table tbody tr').should('have.length', 0);
  });

  it('should display cart totals correctly', () => {
    cy.get('.cart-totals').scrollIntoView().should('be.visible');
    cy.get('.cart-totals tr').contains('th', 'Subtotal').parent().find('td').should('have.text', `$${totalPrice}`);
    cy.get('.cart-totals tr').contains('th', 'VAT').parent().find('td').should('have.text', '$19');
    cy.get('.cart-totals tr').contains('th', 'Total').parent().find('td').should('have.text', `$${totalPrice + 19}`);
  });

  it('should proceed to checkout', () => {
    cy.get('.btn-checkout').scrollIntoView().should('be.visible').click();
    cy.url().should('include', '/shop_checkout');
  });
});
