/// <reference types="cypress" />

describe('Part 1: Authentication', () => {
  beforeEach(() => {
    cy.clearStorage()
  })

  describe('Sign In Page', () => {
    it('should display sign in form', () => {
      cy.visit('/signin')
      cy.contains('Sign In').should('be.visible')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('should navigate to sign up page', () => {
      cy.visit('/signin')
      cy.contains('Sign Up').click()
      cy.url().should('include', '/signup')
    })

    it('should show error for invalid credentials', () => {
      cy.visit('/signin')
      cy.get('input[name="email"]').type('invalid@example.com')
      cy.get('input[name="password"]').type('wrongpassword')
      cy.get('button[type="submit"]').click()
      cy.contains('Invalid credentials', { timeout: 10000 }).should('be.visible')
    })

    it('should successfully login with valid credentials', () => {
      // First register a user
      const email = `test${Date.now()}@example.com`
      const password = 'password123'

      cy.register(email, password)
      cy.url().should('include', '/dashboard')
      cy.contains('Hello').should('be.visible')

      // Logout and login again
      cy.contains('Logout').click()
      cy.url().should('include', '/signin')

      cy.login(email, password)
      cy.url().should('include', '/dashboard')
      cy.contains('Hello').should('be.visible')
    })

    it('should redirect authenticated user to dashboard', () => {
      const email = `test${Date.now()}@example.com`
      const password = 'password123'

      cy.register(email, password)
      cy.visit('/signin')
      cy.url().should('include', '/dashboard')
    })
  })

  describe('Sign Up Page', () => {
    it('should display sign up form', () => {
      cy.visit('/signup')
      cy.contains('Sign Up').should('be.visible')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('input[name="confirmPassword"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('should navigate to sign in page', () => {
      cy.visit('/signup')
      cy.contains('Sign In').click()
      cy.url().should('include', '/signin')
    })

    it('should show error if passwords do not match', () => {
      cy.visit('/signup')
      cy.get('input[name="email"]').type('test@example.com')
      cy.get('input[name="password"]').type('password123')
      cy.get('input[name="confirmPassword"]').type('differentpassword')
      cy.get('button[type="submit"]').click()
      cy.contains('Passwords do not match', { timeout: 10000 }).should('be.visible')
    })

    it('should show error if email already exists', () => {
      const email = `test${Date.now()}@example.com`
      const password = 'password123'

      cy.register(email, password)
      cy.contains('Logout').click()

      // Try to register with same email
      cy.visit('/signup')
      cy.get('input[name="email"]').type(email)
      cy.get('input[name="password"]').type(password)
      cy.get('input[name="confirmPassword"]').type(password)
      cy.get('button[type="submit"]').click()
      cy.contains('User already exists', { timeout: 10000 }).should('be.visible')
    })

    it('should successfully register new user', () => {
      const email = `test${Date.now()}@example.com`
      const password = 'password123'

      cy.register(email, password)
      cy.url().should('include', '/dashboard')
      cy.contains('Hello').should('be.visible')
    })

    it('should redirect authenticated user to dashboard', () => {
      const email = `test${Date.now()}@example.com`
      const password = 'password123'

      cy.register(email, password)
      cy.visit('/signup')
      cy.url().should('include', '/dashboard')
    })
  })

  describe('Session Management', () => {
    it('should maintain session after page reload', () => {
      const email = `test${Date.now()}@example.com`
      const password = 'password123'

      cy.register(email, password)
      cy.reload()
      cy.url().should('include', '/dashboard')
      cy.contains('Hello').should('be.visible')
    })

    it('should logout and clear session', () => {
      const email = `test${Date.now()}@example.com`
      const password = 'password123'

      cy.register(email, password)
      cy.contains('Logout').click()
      cy.url().should('include', '/signin')
      cy.visit('/dashboard')
      cy.url().should('include', '/signin')
    })
  })
})
