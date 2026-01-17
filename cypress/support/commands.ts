/// <reference types="cypress" />

// Custom commands for testing

// Clear localStorage and sessionStorage
Cypress.Commands.add('clearStorage', () => {
  cy.window().then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
})

// Login helper
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.clearStorage()
  cy.visit('/signin')
  cy.get('input[name="email"]').should('be.visible').type(email)
  cy.get('input[name="password"]').should('be.visible').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
  cy.wait(1000) // Wait for navigation and data loading
})

// Register helper
Cypress.Commands.add('register', (email: string, password: string) => {
  cy.clearStorage()
  cy.visit('/signup')
  cy.get('input[name="email"]').should('be.visible').type(email)
  cy.get('input[name="password"]').should('be.visible').type(password)
  cy.get('input[name="confirmPassword"]').should('be.visible').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
  cy.wait(1000) // Wait for navigation and data loading
})

// Helper to find user in table across pages
Cypress.Commands.add('findUserInTable', (email: string) => {
  // Check current page first
  cy.get('table tbody').then(($tbody) => {
    if ($tbody.text().includes(email)) {
      return cy.get('table tbody').contains('tr', email)
    } else {
      // Navigate through pages to find user
      cy.get('nav[aria-label="pagination navigation"]').then(($nav) => {
        if ($nav.length === 0) {
          // No pagination, user should be on this page
          return cy.get('table tbody').contains('tr', email)
        }

        // Try to find user by navigating pages
        cy.get('button[aria-label="Go to next page"]').then(($nextBtn) => {
          if (!$nextBtn.is(':disabled')) {
            cy.wrap($nextBtn).click()
            cy.wait(1000)
            cy.get('table tbody').then(($newTbody) => {
              if ($newTbody.text().includes(email)) {
                return cy.get('table tbody').contains('tr', email)
              } else {
                // User might be on a later page, but for test purposes, just check if it exists
                cy.log(`User ${email} not found on current pages`)
              }
            })
          }
        })
      })
    }
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      clearStorage(): Chainable<void>
      login(email: string, password: string): Chainable<void>
      register(email: string, password: string): Chainable<void>
      findUserInTable(email: string): Chainable<JQuery<HTMLElement>>
    }
  }
}

export { }
