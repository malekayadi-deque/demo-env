describe('Home Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.get('header', { timeout: 10000 }).should('be.visible');
  });

  it('should display the correct page title', () => {
    cy.title().should('match', /Home \|\| Embel \|\| Luxury by design/);
  });

  it('should render all main sections', () => {
    cy.get('header').should('be.visible');
    cy.get('main > div.swiper.swiper-container.swiper-container-horizontal').should('be.visible');
    cy.get('main > section.collections-grid').should('be.visible');
    cy.get('main > section.products-carousel').should('be.visible');
    cy.get('main > section.lookbook-products').should('be.visible');
    cy.get('main > section.blog-carousel').should('be.visible');
    cy.get('main > section.brands-carousel').should('be.visible');
    cy.get('main > section.instagram').should('be.visible');
    cy.get('main > section.service-promotion').should('be.visible');
    cy.get('footer.footer').should('be.visible');
  });

  it('should display slides in the hero', () => {
    cy.get('div.swiper > div.swiper-wrapper > div.swiper-slide')
      .should('have.length.greaterThan', 0);
  });

  it('should navigate to shop from Collections section', () => {
    cy.get('section.collections-grid div.collection-grid__item a[href]').first().should('be.visible');
    cy.get('section.collections-grid div.collection-grid__item a[href]').first().click({ force: true });
    cy.url().should('match', /.*\/shop\w*/);
  });

  it('should display Instagram posts', () => {
    cy.get('main > section.instagram .instagram__tile')
      .should('have.length.greaterThan', 0);
  });
});
