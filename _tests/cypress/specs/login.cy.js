describe('Login and Register Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/login_register');
  });

  it('should display login tab by default', () => {
    cy.get('#login-tab').should('have.class', 'active');
    cy.get('#tab-item-login').should('be.visible');
  });

  it('should switch to register tab', () => {
    cy.get('#register-tab').click();
    cy.get('#register-tab').should('have.class', 'active');
    cy.get('#tab-item-register').should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('input[name="login_email"]').type('test@example.com');
    cy.get('input[name="login_password"]').type('password123');
    cy.contains('button', 'Log In').first().click();
    cy.url().should('include', '/account_dashboard');
  });

  it('should register successfully with valid details', () => {
    cy.get('#register-tab').click();
    cy.get('input[name="register_username"]').type('newuser');
    cy.get('input[name="register_email"]').type('newuser@example.com');
    cy.get('input[name="register_password"]').type('password123');
    cy.contains('button', 'Register').first().click();
    cy.url().should('include', '/account_dashboard');
  });

  it('should validate required fields on login form', () => {
    cy.contains('button', 'Log In').first().click();
    cy.get('input[name="login_email"]').should('have.attr', 'required');
    cy.get('input[name="login_password"]').should('have.attr', 'required');
  });

  it('should validate required fields on register form', () => {
    cy.get('#register-tab').click();
    cy.contains('button', 'Register').first().click();
    cy.get('input[name="register_username"]').should('have.attr', 'required');
    cy.get('input[name="register_email"]').should('have.attr', 'required');
    cy.get('input[name="register_password"]').should('have.attr', 'required');
  });

  it('should navigate to reset password page', () => {
    cy.contains('a', 'Lost password?').first().click();
    cy.url().should('include', '/reset_password');
  });
});
