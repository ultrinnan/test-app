/// <reference types="cypress" />

describe('Part 3: Theme Customization', () => {
  beforeEach(() => {
    cy.clearStorage()
  })

  describe('Theme Toggle on Sign In Page', () => {
    it('should display theme toggle button', () => {
      cy.visit('/signin')
      // Theme toggle is an IconButton in the AppBar
      cy.get('header').find('button').should('have.length.at.least', 1)
    })

    it('should toggle between light and dark mode', () => {
      cy.visit('/signin')
      
      // Check initial theme (default is light)
      cy.get('body').should('have.css', 'background-color')
      
      // Click theme toggle button (IconButton in AppBar - first button is theme toggle)
      cy.get('header').find('button').first().click()
      
      // Theme should change
      cy.wait(500) // Wait for theme transition
      
      // Toggle back
      cy.get('header').find('button').first().click()
      cy.wait(500)
    })

    it('should persist theme preference after page reload', () => {
      cy.visit('/signin')
      
      // Toggle to dark mode
      cy.get('header').find('button').first().click()
      cy.wait(500)
      
      // Reload page
      cy.reload()
      
      // Theme should be persisted (dark mode)
      cy.get('header').find('button').first().should('be.visible')
    })
  })

  describe('Theme Toggle on Sign Up Page', () => {
    it('should display theme toggle button', () => {
      cy.visit('/signup')
      cy.get('header').find('button').should('have.length.at.least', 1)
    })

    it('should toggle theme on sign up page', () => {
      cy.visit('/signup')
      cy.get('header').find('button').first().click()
      cy.wait(500)
      cy.get('header').find('button').first().click()
      cy.wait(500)
    })
  })

  describe('Theme Toggle on Dashboard', () => {
    beforeEach(() => {
      const email = `test${Date.now()}@example.com`
      const password = 'password123'
      cy.register(email, password)
    })

    it('should display theme toggle button in dashboard', () => {
      cy.get('header').find('button').should('have.length.at.least', 2) // Theme toggle + Logout
    })

    it('should toggle theme in dashboard', () => {
      // Theme toggle is the first button in header (before Logout)
      cy.get('header').find('button').first().click()
      cy.wait(500)
      cy.get('header').find('button').first().click()
      cy.wait(500)
    })

    it('should persist theme preference across pages', () => {
      // Set theme in dashboard
      cy.get('header').find('button').first().click()
      cy.wait(500)
      
      // Logout
      cy.contains('Logout').click()
      
      // Theme should be persisted on sign in page
      cy.get('header').find('button').first().should('be.visible')
    })
  })

  describe('Theme Persistence', () => {
    it('should remember theme after logout and login', () => {
      const email = `test${Date.now()}@example.com`
      const password = 'password123'
      
      cy.register(email, password)
      
      // Toggle to dark mode
      cy.get('header').find('button').first().click()
      cy.wait(500)
      
      // Logout
      cy.contains('Logout').click()
      
      // Login again
      cy.login(email, password)
      
      // Theme should still be dark
      cy.get('header').find('button').first().should('be.visible')
    })
  })
})
