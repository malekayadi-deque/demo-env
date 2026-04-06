describe('Order Confirmation Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/order-confirmation');
  });

  it('should display order completion message', () => {
    cy.get('.order-complete__message h3').should('have.text', 'Your order is completed!');
    cy.get('.order-complete__message p').should('have.text', 'Thank you. Your order has been received.');
  });

  it('should display order info details', () => {
    cy.get('.order-info__item').contains('label', 'Order Number').parent().find('span').should('have.text', '13119');
    cy.get('.order-info__item').contains('label', 'Date').parent().find('span')
      .should('have.text', new Date().toLocaleDateString());
    cy.get('.order-info__item').contains('label', 'Total').parent().find('span').should('have.text', '$0');
  });

  it('should display an empty order details table', () => {
    cy.get('.checkout-cart-items tbody tr').should('have.length', 0);
  });
});
